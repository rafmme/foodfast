import DB from '../helpers/dbUtils/dbConn';

(() => {
  DB.query(`INSERT INTO users(
        id, fullname, email, password, is_admin)
        VALUES (
        'be500475-db64-4294-b099-1c1655010452',
        'Farayola Timileyin E',
        'farayola@yah.com',
        '$2b$10$vw3Rj4V/G20QfgGejHYM6ersfXnWo4q4o2A98Gc31QLJ3rPWWMF/S',
        false
        );
        INSERT INTO users(
            id, fullname, email, password, is_admin) VALUES (
                'd96fd881-2096-46f2-88d8-13c925ebbc87',
                'Raf Mme',
                'rafmme@yah.com',
                '$2b$10$vw3Rj4V/G20QfgGejHYM6ersfXnWo4q4o2A98Gc31QLJ3rPWWMF/S',
                false
            );
        INSERT INTO users(
            id, fullname, email, password, is_admin) VALUES (
                'e60771b9-ff84-46ba-afa1-8ffbce70212b',
                'John Kepler',
                'jkepler@yah.com',
                '$2b$10$vw3Rj4V/G20QfgGejHYM6ersfXnWo4q4o2A98Gc31QLJ3rPWWMF/S',
                false
            );

        INSERT INTO users(
            id, fullname, email, password, is_admin) VALUES (
                '2a606085-5a9d-4481-a7e1-e7e98bea2160',
                'Food Fast',
                'admin@foodfast.com',
                '$2b$10$vw3Rj4V/G20QfgGejHYM6ersfXnWo4q4o2A98Gc31QLJ3rPWWMF/S',
                true
            );
     `, (err, res) => {
    if (!res) {
      console.error(err);
    }
  });
})();
