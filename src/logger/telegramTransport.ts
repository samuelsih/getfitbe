import axios from 'axios';
import Transport from 'winston-transport';

const MAX_MESSAGE_LENGTH = 4060;

interface TelegramOptions {
  token: string;
  chatId: string;
  parseMode?: string;
  level?: string;
  handleExceptions?: boolean;
  unique?: boolean;
  silent?: boolean;
  disableNotification?: boolean;
  name?: string;
  template?: string;
  batchingDelay?: number;
  batchingSeparator?: string;
}

interface LogInfo {
  level: string;
  message: string;
  metadata: any;
}

export default class TelegramTransport extends Transport {
  public level: string;
  private token: string;
  private chatId: string;
  private parseMode: string;
  private unique: boolean;
  private disableNotification: boolean;

  constructor(options: TelegramOptions) {
    super(options);

    if (!options.token || !options.chatId) {
      throw new Error(
        "Telegram logger requires 'token' and 'chatId/channelId' property",
      );
    }

    this.token = options.token;
    this.chatId = options.chatId;
    this.parseMode = options.parseMode || '';
    this.level = options.level || 'info';
    this.unique = options.unique || false;
    this.disableNotification = options.disableNotification || false;

    console.log('Telegram Logger created.....');
  }

  log(
    info: LogInfo,
    callback: (error: Error | null, logged: boolean) => void,
  ): void {
    if (this.unique && this.level !== info.level) return callback(null, true);

    this.send(JSON.stringify(info));

    callback(null, true);
  }

  private send(messageText: string): void {
    if (messageText.length < MAX_MESSAGE_LENGTH) {
      this.sendMessage(messageText);
    } else {
      const size = Math.ceil(messageText.length / MAX_MESSAGE_LENGTH);
      const arr = Array(size);
      let offset = 0;

      for (let i = 0; i < size; i++) {
        arr[i] = messageText.substring(offset, MAX_MESSAGE_LENGTH);
        offset += MAX_MESSAGE_LENGTH;
      }
      arr.forEach((message) => this.sendMessage(message));
    }
  }

  private async sendMessage(messageText: string) {
    const requestData = JSON.stringify({
      chat_id: this.chatId,
      text: messageText,
      disable_notification: this.disableNotification,
      parse_mode: this.parseMode,
    });

    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(requestData),
    };

    console.log(messageText);

    try {
      await axios.post(
        `https://api.telegram.org/bot${this.token}/sendMessage`,
        {
          chat_id: this.chatId,
          text: messageText,
          disable_notification: this.disableNotification,
          parse_mode: this.parseMode,
        },
        {
          headers: headers,
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error('[Telegram Error]:', error.message);
      }
      console.error('Unknown error:', error);
    }
  }
}
