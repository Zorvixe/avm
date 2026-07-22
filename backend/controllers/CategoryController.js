import { sql } from "../config/db.js";

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await sql`
      SELECT *
      FROM categories
      ORDER BY id DESC;
    `;

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories.",
    });
  }
};

// Get single category
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await sql`
      SELECT *
      FROM categories
      WHERE id = ${id};
    `;

    if (category.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: category[0],
    });
  } catch (error) {
    console.error("Get Category Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch category.",
    });
  }
};

// Create category
export const createCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      is_active = true,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const existing = await sql`
      SELECT id
      FROM categories
      WHERE LOWER(name)=LOWER(${name});
    `;

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Category already exists.",
      });
    }

    const newCategory = await sql`
      INSERT INTO categories
      (
        name,
        slug,
        is_active
      )
      VALUES
      (
        ${name},
        ${slug || name.toLowerCase().replace(/\s+/g, "-")},
        ${is_active}
      )
      RETURNING *;
    `;

    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: newCategory[0],
    });
  } catch (error) {
    console.error("Create Category Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create category.",
    });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      slug,
      is_active,
    } = req.body;

    const category = await sql`
      UPDATE categories
      SET
        name=${name},
        slug=${slug || name.toLowerCase().replace(/\s+/g, "-")},
        is_active=${is_active}
      WHERE id=${id}
      RETURNING *;
    `;

    if (category.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category[0],
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update category.",
    });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await sql`
      DELETE FROM categories
      WHERE id=${id}
      RETURNING *;
    `;

    if (category.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete category.",
    });
  }
};