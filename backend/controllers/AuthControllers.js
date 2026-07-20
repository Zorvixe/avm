
import {sql} from "../config/db.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const adminRegister = async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory.",
      });
    }

    const existingAdmin = await sql`
      SELECT * FROM users
      WHERE email = ${email};
    `;

    if (existingAdmin.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await sql`
      INSERT INTO users (
        full_name,
        email,
        phone,
        password,
        role
      )
      VALUES (
        ${full_name},
        ${email},
        ${phone},
        ${hashedPassword},
        'admin'
      )
      RETURNING id, full_name, email, phone, role;
    `;

    res.status(201).json({
      success: true,
      message: "Admin registered successfully.",
      data: admin[0],
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await sql`
      SELECT * FROM users
      WHERE email = ${email}
      AND role = 'admin';
    `;

    if (user.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found.",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user[0].password
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    const token = jwt.sign(
  {
    id: user[0].id,
    email: user[0].email,
    role: user[0].role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }
);

res.status(200).json({
  success: true,
  message: "Admin Login Successful",
  token,
  user: {
    id: user[0].id,
    full_name: user[0].full_name,
    email: user[0].email,
    role: user[0].role,
  },
});

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;
    

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory.",
      });
    }

    const existingUser = await sql`
      SELECT * FROM users
      WHERE email = ${email};
    `;

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await sql`
      INSERT INTO users (
        full_name,
        email,
        phone,
        password,
        role
      )
      VALUES (
        ${full_name},
        ${email},
        ${phone},
        ${hashedPassword},
        'customer'
      )
      RETURNING id, full_name, email, phone, role;
    `;

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      data: user[0],
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await sql`
      SELECT * FROM users
      WHERE email = ${email}
      AND role = 'customer';
    `;

    if (user.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Customer account not found.",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user[0].password
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    const token = jwt.sign(
  {
    id: user[0].id,
    email: user[0].email,
    role: user[0].role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }
);

res.status(200).json({
  success: true,
  message: "Login successful.",
  token,
  user: {
    id: user[0].id,
    full_name: user[0].full_name,
    email: user[0].email,
    role: user[0].role,
  },
});

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};