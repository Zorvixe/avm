import { sql } from "../config/db.js";


// Create Coupon

export const createCoupon = async (req, res) => {
  try {

    const {
      code,
      discount_type,
      discount_value,
      min_order,
      max_discount,
      hidden,
      is_active,
    } = req.body;

    if (
      !code ||
      !discount_type ||
      !discount_value
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const existing = await sql`
      SELECT *
      FROM coupons
      WHERE LOWER(code)=LOWER(${code})
    `;

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Coupon already exists.",
      });
    }

    const result = await sql`

      INSERT INTO coupons
      (
        code,
        discount_type,
        discount_value,
        min_order,
        max_discount,
        hidden,
        is_active
      )

      VALUES
      (
        ${code.toUpperCase()},
        ${discount_type},
        ${discount_value},
        ${min_order || 0},
        ${max_discount || null},
        ${hidden || false},
        ${is_active ?? true}
      )

      RETURNING *;
    `;

    res.status(201).json({
      success: true,
      data: result[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};


// Get All Coupons

export const getCoupons = async (req, res) => {
  try {

    const coupons = await sql`

      SELECT *

      FROM coupons

      ORDER BY id DESC

    `;

    res.json({
      success: true,
      data: coupons,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
    });

  }
};


// Get Single Coupon

export const getCoupon = async (req, res) => {
  try {

    const { id } = req.params;

    const coupon = await sql`

      SELECT *

      FROM coupons

      WHERE id=${id}

    `;

    if (coupon.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    res.json({
      success: true,
      data: coupon[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
    });

  }
};


// Update Coupon

export const updateCoupon = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      code,
      discount_type,
      discount_value,
      min_order,
      max_discount,
      hidden,
      is_active,
    } = req.body;

    const result = await sql`

      UPDATE coupons

      SET

      code=${code.toUpperCase()},

      discount_type=${discount_type},

      discount_value=${discount_value},

      min_order=${min_order},

      max_discount=${max_discount || null},

      hidden=${hidden},

      is_active=${is_active}

      WHERE id=${id}

      RETURNING *;

    `;

    res.json({
      success: true,
      data: result[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
    });

  }
};


// Delete Coupon

export const deleteCoupon = async (req, res) => {

  try {

    const { id } = req.params;

    await sql`

      DELETE FROM coupons

      WHERE id=${id}

    `;

    res.json({
      success: true,
      message: "Coupon deleted.",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
    });

  }
};


// Apply Coupon

export const applyCoupon = async (req, res) => {

  try {

    const {
      code,
      subtotal,
    } = req.body;

    const coupon = await sql`

      SELECT *

      FROM coupons

      WHERE
      UPPER(code)=UPPER(${code})
      AND is_active=true

    `;

    if (coupon.length === 0) {

      return res.status(400).json({

        success: false,

        message: "Invalid Coupon",

      });

    }

    const c = coupon[0];

    if (subtotal < Number(c.min_order)) {

      return res.status(400).json({

        success: false,

        message: `Minimum order ₹${c.min_order}`,

      });

    }

    let discount = 0;

    if (c.discount_type === "percentage") {

      discount =
        subtotal * Number(c.discount_value) / 100;

      if (
        c.max_discount &&
        discount > Number(c.max_discount)
      ) {
        discount = Number(c.max_discount);
      }

    } else {

      discount = Number(c.discount_value);

    }

    res.json({

      success: true,

      coupon: c,

      discount,

      finalTotal: subtotal - discount,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

    });

  }
};
export const getAvailableCoupons = async (req, res) => {
  try {
    const coupons = await sql`
      SELECT *
      FROM coupons
      WHERE is_active = true
      ORDER BY id DESC
    `;

    res.json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};