import DB from '../helpers/dbUtils/dbConn';

(() => {
  DB.query(`INSERT INTO orders(
        id, food_id, customer_id,
        quantity, total_price,
        delivery_address, phone_number,
        status
        ) VALUES (
            '59b85175-21d0-4af7-bfa8-9dff0f902a98',
            '31097fb0-d548-48f0-8613-5073d6ebecd7',
            'be500475-db64-4294-b099-1c1655010452',
            2,18000,'N0 235 Ikorodu, lagos',
            '08012345678','New'
        );
        INSERT INTO orders(
        id, food_id, customer_id,
        quantity, total_price,
        delivery_address, phone_number,
        status
        ) VALUES (
            'c10cd6a8-07f1-4026-a480-139b851cfd80',
            '31097fb0-d548-48f0-8613-5073d6ebecd7',
            'd96fd881-2096-46f2-88d8-13c925ebbc87',
            1,9000,'N0 237 Ikorodu, lagos',
            '08012344678','Processing'
        );
        INSERT INTO orders(
        id, food_id, customer_id,
        quantity, total_price,
        delivery_address, phone_number,
        status
        ) VALUES (
            '131130dd-51b3-4863-9298-88aee2738028',
            'a768b2c5-6cbf-4ee2-a3ab-b3a04529b963',
            'e60771b9-ff84-46ba-afa1-8ffbce70212b',
            3,1500,'Alausa, Ikeja','08098765432',
            'Cancelled'
        );
        INSERT INTO orders(
            id, food_id, customer_id,
            quantity, total_price,
            delivery_address, phone_number,
            status
            ) VALUES (
                'fe5557e1-f22e-4a1e-867b-7ead92e01fbd',
                '3b23f271-9dfb-4331-996c-c7c732f330e6',
                'e60771b9-ff84-46ba-afa1-8ffbce70212b',
                5,25000,'Akowonjo, Egbeda, Lagos',
                '08098765432','Complete'
            );
            INSERT INTO orders(
                id, food_id, customer_id,
                quantity, total_price,
                delivery_address, phone_number,
                status
                ) VALUES (
                    '49c67d58-cce4-49a6-883b-930e65dc08fb',
                    '94092cf4-d9f1-4e3b-b731-ce92275350b6',
                    'be500475-db64-4294-b099-1c1655010452',
                    3,3000,'N0 235 Ikorodu, lagos',
                    '08012345678','New'
                );
     `, (err, res) => {
    if (!res) {
      console.error(err);
    }
  });
})();
