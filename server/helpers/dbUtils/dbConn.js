import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.load();

/**
 * @description Create Pool connection config for each environment
 * @returns {object} Pool config object
 */
const setDBConnection = () => {
  const {
    NODE_ENV,
    TEST_DB,
    DEV_DB,
    DATABASE_URL
  } = process.env;
  let config;
  if (NODE_ENV === 'development') {
    config = DEV_DB;
  } else if (NODE_ENV === 'test') {
    config = TEST_DB;
  } else {
    config = DATABASE_URL;
  }
  return config;
};

const pool = new Pool({
  connectionString: setDBConnection()
});

export default pool;
