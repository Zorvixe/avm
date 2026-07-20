import {sql} from "../config/db.js"


export const getProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT *
      FROM products
      ORDER BY created_at DESC
    `;

    for (const product of products) {
      const packages = await sql`
        SELECT
          size,
          price
        FROM product_packages
        WHERE product_id = ${product.id}
        ORDER BY id
      `;

      product.packageSizes = packages;
    }

    res.json({
      success: true,
      data: products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await sql`
      SELECT *
      FROM products
      WHERE id = ${id}
    `;

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const packages = await sql`
      SELECT
        size,
        price
      FROM product_packages
      WHERE product_id = ${id}
      ORDER BY id
    `;

    product[0].packageSizes = packages;

    res.json({
      success: true,
      data: product[0],
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const postProducts = async (req, res) => {
  try {

    const {
      title,
      subtitle,
      category,
      badge,
      stock,
      description,
      image,
      slug,
      packageSizes,
      crops,
      features,
      nitrogen,
      phosphorus,
      potassium,
      sulphur,
      zinc,
    } = req.body;

    const [product] = await sql`
      INSERT INTO products (

        title,
        subtitle,
        category,
        badge,
        stock,
        description,
        image,
        slug,
        crops,
        features,
        nitrogen,
        phosphorus,
        potassium,
        sulphur,
        zinc

      )

      VALUES (

        ${title},
        ${subtitle},
        ${category},
        ${badge},
        ${stock},
        ${description},
        ${image},
        ${slug},
        ${crops},
        ${features},
        ${nitrogen},
        ${phosphorus},
        ${potassium},
        ${sulphur},
        ${zinc}

      )

      RETURNING *;
    `;

    for (const pkg of packageSizes) {
      await sql`
        INSERT INTO product_packages (

          product_id,
          size,
          price

        )

        VALUES (

          ${product.id},
          ${pkg.size},
          ${pkg.price}

        )
      `;
    }

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      data: product,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const updateProducts = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      title,
      subtitle,
      category,
      badge,
      stock,
      description,
      image,
      slug,
      packageSizes,
      crops,
      features,
      nitrogen,
      phosphorus,
      potassium,
      sulphur,
      zinc,
    } = req.body;

    const [product] = await sql`
      UPDATE products

      SET

      title=${title},
      subtitle=${subtitle},
      category=${category},
      badge=${badge},
      stock=${stock},
      description=${description},
      image=${image},
      slug=${slug},
      crops=${crops},
      features=${features},
      nitrogen=${nitrogen},
      phosphorus=${phosphorus},
      potassium=${potassium},
      sulphur=${sulphur},
      zinc=${zinc},
      updated_at=CURRENT_TIMESTAMP

      WHERE id=${id}

      RETURNING *;
    `;

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await sql`
      DELETE FROM product_packages
      WHERE product_id = ${id}
    `;

    for (const pkg of packageSizes) {
      await sql`
        INSERT INTO product_packages (

          product_id,
          size,
          price

        )

        VALUES (

          ${id},
          ${pkg.size},
          ${pkg.price}

        )
      `;
    }

    res.json({
      success: true,
      message: "Product Updated Successfully",
      data: product,
    });

  } catch (error) {
  console.error("UPDATE PRODUCT ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

export const deleteProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await sql`
      DELETE FROM products
      WHERE id = ${id}
      RETURNING *;
    `;

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product Deleted Successfully",
    });

  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




