import { sql } from "../config/db.js";

export const createSettingsTable = async () => {
  // Settings key-value store
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      id SERIAL PRIMARY KEY,
      key VARCHAR(100) UNIQUE NOT NULL,
      value TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Seed default settings
  const defaults = [
    { key: "razorpay_key_id", value: "" },
    { key: "razorpay_key_secret", value: "" },
    { key: "shiprocket_email", value: "" },
    { key: "shiprocket_password", value: "" },
    { key: "shiprocket_pickup_pincode", value: "" },
    { key: "shiprocket_webhook_secret", value: "" },
    { key: "shiprocket_default_pickup_id", value: "" },
    { key: "shiprocket_default_pickup_name", value: "" },
  ];

  for (const s of defaults) {
    await sql`
      INSERT INTO settings (key, value)
      VALUES (${s.key}, ${s.value})
      ON CONFLICT (key) DO NOTHING;
    `;
  }

  // Shiprocket token cache
  await sql`
    CREATE TABLE IF NOT EXISTS shiprocket_tokens (
      id SERIAL PRIMARY KEY,
      token TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Vendor/admin pickup addresses synced to Shiprocket
  await sql`
    CREATE TABLE IF NOT EXISTS vendor_pickup_addresses (
      id SERIAL PRIMARY KEY,
      location_name VARCHAR(255) NOT NULL,
      address_line1 TEXT NOT NULL,
      address_line2 TEXT,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      pincode VARCHAR(10) NOT NULL,
      is_default BOOLEAN DEFAULT false,
      shiprocket_pickup_id VARCHAR(100),
      shiprocket_synced BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log("Settings, shiprocket_tokens, vendor_pickup_addresses tables ready");
};
