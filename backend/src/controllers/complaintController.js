const db = require('../config/db');

// GET /api/complaints - Employees see own; Admins see all with submitter details
const getComplaints = async (req, res) => {
  try {
    if (req.user.role === 'Admin') {
      const result = await db.query(
        `SELECT c.id, c.title, c.description, c.status, c.remarks, c.created_at,
                u.employee_id, u.email AS submitted_by
         FROM complaints c
         JOIN users u ON c.user_id = u.id
         ORDER BY 
           CASE WHEN c.status = 'Pending' THEN 1 ELSE 2 END,
           c.created_at DESC`
      );
      return res.json(result.rows);
    }

    const result = await db.query(
      `SELECT id, title, description, status, remarks, created_at
       FROM complaints
       WHERE user_id = $1
       ORDER BY 
         CASE WHEN status = 'Pending' THEN 1 ELSE 2 END,
         created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching complaints:', err);
    res.status(500).json({ message: 'Failed to retrieve complaints.' });
  }
};

// GET /api/complaints/:id - Single complaint details
const getComplaintById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT c.id, c.title, c.description, c.status, c.remarks, c.user_id, c.created_at,
              u.employee_id, u.email AS submitted_by
       FROM complaints c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [id]
    );

    const complaint = result.rows[0];
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    // Employees can only inspect their own complaints
    if (req.user.role === 'Employee' && complaint.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access forbidden.' });
    }

    res.json(complaint);
  } catch (err) {
    console.error('Error fetching complaint:', err);
    res.status(500).json({ message: 'Failed to retrieve complaint details.' });
  }
};

// POST /api/complaints - Employee submits a new complaint
const createComplaint = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  try {
    const result = await db.query(
      `INSERT INTO complaints (user_id, title, description, status)
       VALUES ($1, $2, $3, 'Pending')
       RETURNING id, title, description, status, created_at`,
      [req.user.id, title.trim(), description.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating complaint:', err);
    res.status(500).json({ message: 'Failed to submit complaint.' });
  }
};

// PATCH /api/complaints/:id/status - Admin updates resolution status
const updateComplaintStatus = async (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;

  if (!['Pending', 'Resolved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }
  
  if(status==="Rejected" && !remarks){
    return res.status(400).json({ message: 'Remarks is required if status is rejected' });
  }

  try {
    const result = await db.query(
      `UPDATE complaints
       SET status = $1,
       remarks = $2
       WHERE id = $3
       RETURNING id, title, description, status, remarks, created_at`,
      [status,  remarks?.trim() || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating complaint status:', err);
    res.status(500).json({ message: 'Failed to update complaint status.' });
  }
};

// DELETE /api/complaints/:id - Employee deletes own; Admin deletes any
const deleteComplaint = async (req, res) => {
  const { id } = req.params;
  try {
    const check = await db.query('SELECT user_id FROM complaints WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    if (req.user.role === 'Employee' && check.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own complaints.' });
    }

    await db.query('DELETE FROM complaints WHERE id = $1', [id]);
    res.json({ message: 'Complaint deleted successfully.' });
  } catch (err) {
    console.error('Error deleting complaint:', err);
    res.status(500).json({ message: 'Failed to delete complaint.' });
  }
};

module.exports = {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint,
};