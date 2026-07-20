import { createProductsTable } from "./ProductsTable.js";
import { createOrdersTable } from "./OrdersTable.js";
import { createUsersTable } from "./UsersTable.js";
import { createOrderItemsTable } from "./OrderItemsTable.js";
import { createSettingsTable } from "./SettingsTable.js";

export const initDatabase = async () => {
  try {
    await createUsersTable();
    await createProductsTable();
    await createOrdersTable();
    await createOrderItemsTable();
    await createSettingsTable();

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
};