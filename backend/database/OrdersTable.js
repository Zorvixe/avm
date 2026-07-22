import { sql } from "../config/db.js";

export const createOrdersTable = async () => {
  // Base orders table
  await sql`
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,

    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20) NOT NULL,

    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),

    house_no VARCHAR(255),
    street_area VARCHAR(255),
    landmark VARCHAR(255),
    country VARCHAR(50) DEFAULT 'India',

    total_amount NUMERIC(10,2) NOT NULL,

    discount NUMERIC(10,2) DEFAULT 0,
    coupon_id INTEGER,

    payment_method VARCHAR(50) DEFAULT 'Cash on Delivery',
    payment_status VARCHAR(50) DEFAULT 'Pending',
    order_status VARCHAR(50) DEFAULT 'Placed',

    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),

    shiprocket_order_id VARCHAR(100),
    shiprocket_shipment_id VARCHAR(100),
    awb_code VARCHAR(100),

    pickup_address_line1 TEXT,
    pickup_address_line2 TEXT,
    pickup_city VARCHAR(100),
    pickup_state VARCHAR(100),
    pickup_pincode VARCHAR(10),
    pickup_location_name VARCHAR(255),
    pickup_schedule_date VARCHAR(50),
    pickup_schedule_time VARCHAR(100),
    pickup_schedule_display VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

  // Add all extended columns (safe: IF NOT EXISTS equivalent via ALTER)
  const alterStatements = [
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount NUMERIC(10,2) DEFAULT 0`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_id INTEGER`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS house_no VARCHAR(255)`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS street_area VARCHAR(255)`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS landmark VARCHAR(255)`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS country VARCHAR(50) DEFAULT 'India'`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255)`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(255)`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shiprocket_order_id VARCHAR(100)`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shiprocket_shipment_id VARCHAR(100)`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS awb_code VARCHAR(100)`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickup_address_line1 TEXT`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickup_address_line2 TEXT`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickup_city VARCHAR(100)`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickup_state VARCHAR(100)`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickup_pincode VARCHAR(10)`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickup_location_name VARCHAR(255)`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickup_schedule_date VARCHAR(50)`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickup_schedule_time VARCHAR(100)`,
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickup_schedule_display VARCHAR(255)`,
  ];

  for (const stmt of alterStatements) {
    await sql.unsafe(stmt);
  }

  console.log("Orders table ready with all columns");
};

export const createOrderItemsTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER,
      product_name VARCHAR(255),
      product_image TEXT,
      package_size VARCHAR(100),
      price NUMERIC(10,2) NOT NULL,
      quantity INTEGER NOT NULL,
      subtotal NUMERIC(10,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log("Order items table ready");
};