require('dotenv').config();//instatiate environment variables

CONFIG = {} //Make this global to use all over the application

CONFIG.app          = process.env.APP   || 'mtgback';
CONFIG.port         = process.env.PORT  || '8000';

CONFIG.db_dialect   = process.env.DB_DIALECT    || 'postgres';
CONFIG.db_host      = process.env.DB_HOST       || 'localhost';
CONFIG.db_port      = process.env.DB_PORT       || '5432';
CONFIG.db_name      = process.env.DB_NAME       || 'seekdb';
CONFIG.db_user      = process.env.DB_USER       || 'admin';
CONFIG.db_password  = process.env.DB_PASSWORD   || '1234';
CONFIG.DATABASE_URL = process.env.DATABASE_URL;

CONFIG.jwt_encryption  = process.env.JWT_ENCRYPTION || 'mtgback';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || '10000';
