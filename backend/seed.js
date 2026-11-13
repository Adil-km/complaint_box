const bcrypt = require('bcryptjs');
const db = require('./src/config/db');
require('dotenv').config();

async function seedAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin@123', 10);
    await db.query(
      `INSERT INTO users (employee_id, email, password, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      [null, 'admin@gmail.com', hashedPassword, 'Admin']
    );
    console.log('Initial Admin seeded: admin@gmail.com / admin@123');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
}

seedAdmin();