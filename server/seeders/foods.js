import DB from '../helpers/dbUtils/dbConn';

(() => {
  DB.query(`INSERT INTO foods(
    id, title, description,
    price, image_url
    ) VALUES (
        '9a16481a-88cc-4145-85c1-52c8344fdf9a',
        'Fried Corn Beef',
        'Highly delicious meal, contain required calories you need to last the day',
         4000, 'hhtps://googl.gy/fcbf.jpg'
    );
    INSERT INTO foods(
    id, title, description,
    price, image_url
    ) VALUES (
        'a768b2c5-6cbf-4ee2-a3ab-b3a04529b963',
        'Rice Sausage',
        'Highly delicious meal, contain required calories you need to last the day',
         500, 'hhtps://googl.gy/rcssr.jpg'
        );
        INSERT INTO foods(
        id, title, description,
        price, image_url
        ) VALUES (
            '31097fb0-d548-48f0-8613-5073d6ebecd7',
            'Jollof rice',
            'Highly delicious meal, contain required calories you need to last the day',
             9000, 'hhtps://googl.gy/fcbf.jpg'
            );
        INSERT INTO foods(
            id, title, description,
            price, image_url
            ) VALUES (
                '3b23f271-9dfb-4331-996c-c7c732f330e6',
                'Semovita with Egusi soup',
                'Highly delicious meal, contain required calories you need to last the day',
                 5000, 'hhtps://googl.gy/fcbf.jpg'
                );
            INSERT INTO foods(
                id, title, description,
                price, image_url
                ) VALUES (
                    '94092cf4-d9f1-4e3b-b731-ce92275350b6',
                    'Pounded yam with Efo riro',
                    'Highly delicious meal, contain required calories you need to last the day',
                     1000, 'hhtps://googl.gy/fcbf.jpg'
                    );
    `, (err, res) => {
    if (!res) {
      console.error(err);
    }
  });
})();
