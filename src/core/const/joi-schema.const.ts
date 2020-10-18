import Joi from '@hapi/joi';
import { IEnvConfig } from '../abstract/env-config.interface';
import { JoiSchemeMap } from '../type/joi-schame-map.type';

export const JoiSchema: JoiSchemeMap<IEnvConfig> = {
  NODE_ENV: Joi.string()
    .valid(['development', 'production', 'test'])
    .default('development'),

  PORT: Joi.number().default(3000),
  GQL_DEBUG: Joi.boolean().default(false),
  GQL_PLAYGROUND: Joi.boolean().default(false),

  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().allow('').default(''),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SYNCHRONIZE: Joi.boolean().default(false),
  DATABASE_LOGGING: Joi.boolean().default(false),
  DATABASE_KEEP_CONNECTION_ALIVE: Joi.boolean().default(true),
  DATABASE_MIGRATIONS_RUN: Joi.boolean().default(true),
  DATABASE_MIGRATIONS_TABLE_NAME: Joi.string().required(),
  DATABASE_SSL_CA: Joi.string().default('').allow(''),
  DATABASE_SSL_CERT: Joi.string().default('').allow(''),
  DATABASE_SSL_KEY: Joi.string().default('').allow(''),
  IS_USE_SSL: Joi.boolean().default(false),

  TS_NODE: Joi.boolean().default(false),
};
