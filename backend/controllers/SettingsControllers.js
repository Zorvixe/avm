import { sql } from "../config/db.js";
import { authenticateShiprocket, clearShiprocketCache, getShiprocketConfig } from "./ShiprocketControllers.js";

// GET all settings (admin only)
export const getSettings = async (req, res) => {
  try {
    const settings = await sql`SELECT key, value FROM settings ORDER BY key`;
    const map = {};
    for (const row of settings) map[row.key] = row.value;
    res.json({ success: true, settings: map });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT update a single setting (admin only)
export const updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ success: false, message: "Value is required" });
    }

    await sql`
      INSERT INTO settings (key, value, updated_at)
      VALUES (${key}, ${value}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = NOW()
    `;

    res.json({ success: true, message: "Setting updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettingsBulk = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const entries = Object.entries(req.body || {});
    console.log(entries);

    for (const [key, value] of entries) {
      console.log("Saving:", key, value);

      if (value === undefined || value === null) continue;

      await sql`
        INSERT INTO settings (key, value, updated_at)
        VALUES (${key}, ${String(value)}, NOW())
        ON CONFLICT (key)
        DO UPDATE SET
          value = ${String(value)},
          updated_at = NOW()
      `;
    }

    console.log("Saved successfully");

    res.json({
      success: true,
      message: "Settings saved",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getShiprocketSettings = async (req, res) => {
  try {
    const config = await getShiprocketConfig();
    const rows = await sql`
      SELECT key, value FROM settings
      WHERE key IN ('shiprocket_default_pickup_id', 'shiprocket_default_pickup_name')
    `;

    for (const row of rows) config[row.key] = row.value || "";
    if (config.shiprocket_password) config.shiprocket_password = "********";
    if (config.shiprocket_webhook_secret) config.shiprocket_webhook_secret = "********";

    res.json({ success: true, settings: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const testShiprocketConnection = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (email) {
      await sql`
        INSERT INTO settings (key, value, updated_at)
        VALUES ('shiprocket_email', ${email.trim()}, NOW())
        ON CONFLICT (key) DO UPDATE SET value = ${email.trim()}, updated_at = NOW()
      `;
    }

    if (password && password !== "********") {
      await sql`
        INSERT INTO settings (key, value, updated_at)
        VALUES ('shiprocket_password', ${password}, NOW())
        ON CONFLICT (key) DO UPDATE SET value = ${password}, updated_at = NOW()
      `;
    }

    clearShiprocketCache();
    await authenticateShiprocket();
    res.json({ success: true, message: "Shiprocket connection successful" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET public Razorpay key_id (no auth — frontend needs this)
export const getPublicRazorpayKey = async (req, res) => {
  try {
    const rows = await sql`SELECT value FROM settings WHERE key = 'razorpay_key_id'`;
    const keyId = rows[0]?.value || process.env.RAZORPAY_KEY_ID || "";
    res.json({ success: true, key_id: keyId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
