import DB from '../../helpers/dbUtils/dbConn';

(() => {
  DB.query(`CREATE TABLE IF NOT EXISTS users (id uuid PRIMARY KEY,
      fullname VARCHAR(300) not null,
      email VARCHAR (200) not null,
      password VARCHAR (255) not null,
      is_admin boolean default false not null,
      created_at TIMESTAMP default NOW(),
      updated_at TIMESTAMP default NOW(),
      unique(email)
  );
    CREATE TABLE IF NOT EXISTS foods (id uuid PRIMARY KEY,
      title VARCHAR(150) not null,
      description TEXT not null,
      price INTEGER not null,
      image_url TEXT not null,
      created_at TIMESTAMP default NOW(),
      updated_at TIMESTAMP default NOW()
  );
    CREATE TYPE order_status AS ENUM (
      'New', 'Processing', 'Cancelled', 'Complete'
  );
    CREATE TABLE IF NOT EXISTS orders (id uuid PRIMARY KEY,
      food_id uuid not null references foods(id),
      customer_id uuid not null references users(id),
      quantity integer not null,
      total_price integer not null,
      delivery_address TEXT not null,
      phone_number VARCHAR(11) not null,
      status order_status default 'New' not null,
      created_at TIMESTAMP default NOW(),
      updated_at TIMESTAMP default NOW()
 );
`, (err, res) => {
    if (!res) {
      console.error(err);
    }
  });
})();
