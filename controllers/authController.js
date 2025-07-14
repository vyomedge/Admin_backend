const jwt = require('jsonwebtoken');
const User = require('../config/usersDb');
const getPanelDb = require('../config/dbManager');

const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
      panel: user.panel,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, panel } = req.body;
    const user = await User.create({ name, email, password, role, panel });
    const token = signToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, panel } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    if (user.panel !== panel)
      return res.status(403).json({ message: `Access denied to ${panel} panel` });

    // Optional: connect to panel DB and return confirmation
    const db = getPanelDb(panel);
    // You can use this DB for fetching panel-specific data now

    const token = signToken(user);
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};