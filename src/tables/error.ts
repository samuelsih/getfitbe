export enum PostgresErrorCode {
  NotNullViolation = '23502',
  ForeignKeyViolation = '23503',
  UniqueViolation = '23505',
}

export interface DatabaseError {
  code: PostgresErrorCode;
  detail: string;
  table: string;
  column?: string;
}

export function isDatabaseError(value: unknown): value is DatabaseError {
  if (!isRecord(value)) {
    return false;
  }
  const { code, detail, table } = value;
  return Boolean(code && detail && table);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
