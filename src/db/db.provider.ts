import { ConfigurableModuleBuilder, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Tables } from './table';

export interface DatabaseOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

@Injectable()
export class DBProvider extends Kysely<Tables> {}

export const {
  ConfigurableModuleClass: ConfigureDatabaseModule,
  MODULE_OPTIONS_TOKEN: DATABASE_OPTIONS,
} = new ConfigurableModuleBuilder<DatabaseOptions>()
  .setClassMethodName('forRoot')
  .build();
