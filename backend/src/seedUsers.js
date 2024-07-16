import pool from './db.js';
import bcrypt from 'bcryptjs';

const seedUsers = async () => {
  const email = 'test@gmail.com';
  const password = 'testpassword';
  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING', [email, hashedPassword]);
  console.log('Users seeded successfully.');
  pool.end();
};

seedUsers().catch((err) => {
  console.error('Error seeding users:', err);
  pool.end();
});
