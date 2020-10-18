import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import { JoiSchema } from '../const/joi-schema.const';
import { IEnvConfig } from '../abstract/env-config.interface';
import { Service } from 'typedi';

@Service()
export class ConfigService {
  private readonly envConfig: IEnvConfig;

  constructor() {
    dotenv.config();
    this.envConfig = this.validateInput(process.env as any);
  }

  private validateInput(envConfig: IEnvConfig): IEnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object(JoiSchema);

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
      { allowUnknown: true },
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig;
  }

  get port(): number {
    return this.envConfig.PORT;
  }

  get isGraphQLDebugEnabled(): boolean {
    return this.envConfig.GQL_DEBUG;
  }

  get isGraphQLPlaygroundEnabled(): boolean {
    return this.envConfig.GQL_PLAYGROUND;
  }

  get database() {
    return {
      host: this.envConfig.DATABASE_HOST,
      port: this.envConfig.DATABASE_PORT,
      username: this.envConfig.DATABASE_USERNAME,
      password: this.envConfig.DATABASE_PASSWORD,
      database: this.envConfig.DATABASE_NAME,
      synchronize: this.envConfig.DATABASE_SYNCHRONIZE,
      logging: this.envConfig.DATABASE_LOGGING,
      keepConnectionAlive: this.envConfig.DATABASE_KEEP_CONNECTION_ALIVE,
      migrations: {
        run: this.envConfig.DATABASE_MIGRATIONS_RUN,
        tableName: this.envConfig.DATABASE_MIGRATIONS_TABLE_NAME,
      },
      ssl: {
        ca: this.envConfig.DATABASE_SSL_CA,
        key: this.envConfig.DATABASE_SSL_KEY,
        cert: this.envConfig.DATABASE_SSL_CERT,
        isUse: this.envConfig.IS_USE_SSL,
      },
    };
  }

  get tsNode() {
    return this.envConfig.TS_NODE;
  }
}
