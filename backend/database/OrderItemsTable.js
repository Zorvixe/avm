import { sql } from "../config/db.js";

export const createOrderItemsTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS order_items (

      id SERIAL PRIMARY KEY,

      order_id INTEGER
      REFERENCES orders(id)
      ON DELETE CASCADE,

      product_id INTEGER
      REFERENCES products(id)
      ON DELETE SET NULL,

      product_name VARCHAR(255) NOT NULL,

      product_image TEXT,

      package_size VARCHAR(100) NOT NULL,

      price NUMERIC(10,2) NOT NULL,

      quantity INTEGER NOT NULL,

      subtotal NUMERIC(10,2) NOT NULL

    );
  `;

  console.log("Order Items table created");
};