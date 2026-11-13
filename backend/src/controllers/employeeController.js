const bcrypt = require('bcryptjs');
const db = require('../config/db');

// GET /api/employees - List all employees
const getAllEmployees = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, employee_id, email, created_at 
       FROM users 
       WHERE role = 'Employee' 
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Failed to retrieve employees.' });
  }
};

// GET /api/employees/:id - Get single employee by primary key ID
const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT id, employee_id, email 
       FROM users 
       WHERE id = $1 AND role = 'Employee'`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).json({ message: 'Failed to retrieve employee details.' });
  }
};

// POST /api/employees - Create a new employee
const createEmployee = async (req, res) => {
  const { employee_id, email, password } = req.body;

  if (!employee_id || !email || !password) {
    return res.status(400).json({ message: 'Employee ID, email, and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (employee_id, email, password, role)
       VALUES ($1, $2, $3, 'Employee')
       RETURNING id, employee_id, email, role, created_at`,
      [employee_id.trim(), email.trim().toLowerCase(), hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    // PostgreSQL unique violation error code
    if (err.code === '23505') {
      return res.status(409).json({ message: 'An account with this Employee ID or Email already exists.' });
    }
    console.error('Error creating employee:', err);
    res.status(500).json({ message: 'Failed to create employee.' });
  }
};

// PUT /api/employees/:id - Update employee email and optionally password
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    let query;
    let params;

    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = `UPDATE users 
               SET email = $1, password = $2 
               WHERE id = $3 AND role = 'Employee' 
               RETURNING id, employee_id, email`;
      params = [email.trim().toLowerCase(), hashedPassword, id];
    } else {
      query = `UPDATE users 
               SET email = $1 
               WHERE id = $2 AND role = 'Employee' 
               RETURNING id, employee_id, email`;
      params = [email.trim().toLowerCase(), id];
    }

    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'This email is already in use by another account.' });
    }
    console.error('Error updating employee:', err);
    res.status(500).json({ message: 'Failed to update employee.' });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
};