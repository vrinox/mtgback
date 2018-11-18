require('dotenv').config();//instatiate environment variables

CONFIG = {} //Make this global to use all over the application

CONFIG.app          = process.env.APP       || 'mtgback';
CONFIG.port         = process.env.PORT      || '8000';
CONFIG.environment  = process.env.ENVIROMENT|| 'dev';

CONFIG.db_dialect   = process.env.DB_DIALECT    || 'postgres';
CONFIG.db_host      = process.env.DB_HOST       || 'ec2-79-125-12-27.eu-west-1.compute.amazonaws.com';
CONFIG.db_port      = process.env.DB_PORT       || '5432';
CONFIG.db_name      = process.env.DB_NAME       || 'da3gp9ioktteud';
CONFIG.db_user      = process.env.DB_USER       || 'dyybldixnzggrl';
CONFIG.db_password  = process.env.DB_PASSWORD   || 'ce6cf52668943015ef562bc6ef980e13ed2693dff1d29b485761d6fd87a48e5a';
CONFIG.databaseUrl  = process.env.DATABASE_URL;
CONFIG.log_body     = process.env.LOG_BODY      ||  1;

CONFIG.jwt_encryption  = process.env.JWT_ENCRYPTION || 'mtgback';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || '10000';

CONFIG.onesignal = {
  userAuthKey  : process.env.ONESIGNAL_USER_AUTH_KEY,
  appAuthKey   : process.env.ONESIGNAL_APP_AUTH_KEY,
  appId        : process.env.ONESIGNAL_APP_ID,
};
