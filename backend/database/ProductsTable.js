import { sql } from "../config/db.js";

export const createProductsTable = async () => {

  // Products Table
  await sql`
    CREATE TABLE IF NOT EXISTS products (

      id SERIAL PRIMARY KEY,

      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255),

      category VARCHAR(100),
      badge VARCHAR(100),

      image TEXT,
      slug VARCHAR(255) UNIQUE NOT NULL,

      stock VARCHAR(50),

      description TEXT,

      crops TEXT,
      features TEXT,

      nitrogen VARCHAR(20),
      phosphorus VARCHAR(20),
      potassium VARCHAR(20),
      sulphur VARCHAR(20),
      zinc VARCHAR(20),

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    );
  `;

  console.log("Products table created");


  // Product Packages Table
  await sql`
    CREATE TABLE IF NOT EXISTS product_packages (

      id SERIAL PRIMARY KEY,

      product_id INTEGER
      REFERENCES products(id)
      ON DELETE CASCADE,

      size VARCHAR(100) NOT NULL,

      price NUMERIC(10,2) NOT NULL

    );
  `;

  console.log("Product Packages table created");
};