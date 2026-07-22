import { sql } from "../config/db.js";

export const createCouponsTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS coupons (
      id SERIAL PRIMARY KEY,

      code VARCHAR(50) UNIQUE NOT NULL,

      discount_type VARCHAR(20) NOT NULL
      CHECK (discount_type IN ('percentage','fixed')),

      discount_value NUMERIC(10,2) NOT NULL,

      min_order NUMERIC(10,2) DEFAULT 0,

      max_discount NUMERIC(10,2),

      hidden BOOLEAN DEFAULT FALSE,

      is_active BOOLEAN DEFAULT TRUE,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log("Coupons table ready");
};