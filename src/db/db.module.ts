import { Global, Module } from '@nestjs/common';
import {
  ConfigureDatabaseModule,
  DATABASE_OPTIONS,
  DBProvider,
  DatabaseOptions,
} from './db.provider';
import { Pool } from 'pg';
import { PostgresDialect } from 'kysely';

@Global()
@Module({
  exports: [DBProvider],
  providers: [
    {
      provide: DBProvider,
      inject: [DATABASE_OPTIONS],
      useFactory: (opts: DatabaseOptions) => {
        const dialect = new PostgresDialect({
          pool: new Pool({
            host: opts.host,
            port: opts.port,
            user: opts.user,
            password: opts.password,
            database: opts.database,
          }),
        });

        return new DBProvider({ dialect });
      },
    },
  ],
})
export class DBModule extends ConfigureDatabaseModule {}
