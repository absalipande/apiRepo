import pool from '../db.js';
import bcrypt from 'bcryptjs';

export const createUser = async (email, password, geoData) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query('INSERT INTO users (email, password, geolocation) VALUES ($1, $2, $3) RETURNING *', [email, hashedPassword, geoData]);
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};
