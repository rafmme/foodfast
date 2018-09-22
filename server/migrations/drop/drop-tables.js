import DB from '../../helpers/dbUtils/dbConn';

(() => {
  DB.query(`DROP TABLE IF EXISTS users, orders, foods CASCADE;
            DROP TYPE IF EXISTS order_status;
            `, (err, res) => {
    if (!res) {
      console.error(err);
    }
  });
})();
