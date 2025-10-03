// routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { jwtAuth, checkUserExistsAndNotBlocked } = require('../middleware/authCheck');

router.use(jwtAuth, checkUserExistsAndNotBlocked);

// GET users sorted by lastLogin descending
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email status lastLogin createdAt').sort({ lastLogin: -1 });
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

router.post('/block', async (req, res) => {
  try {
    const { ids } = req.body;
    await User.updateMany({ _id: { $in: ids } }, { $set: { status: 'blocked' } });
    res.json({ message: 'Blocked.' });
  } catch (e) { res.status(500).json({ message: 'Block failed.' }); }
});

router.post('/unblock', async (req, res) => {
  try {
    const { ids } = req.body;
    const result = await User.updateMany(
      { _id: { $in: ids }, status: 'blocked' },
      { $set: { status: 'active' } }
    );
    res.json({ 
      message: 'Unblocked.', 
      modifiedCount: result.modifiedCount 
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Unblock failed.' });
  }
});


router.post('/delete', async (req, res) => {
  try {
    const { ids } = req.body;
    await User.deleteMany({ _id: { $in: ids } });
    res.json({ message: 'Deleted.' });
  } catch (e) { res.status(500).json({ message: 'Delete failed.' }); }
});

router.post('/delete-unverified', async (req, res) => {
  try {
    await User.deleteMany({ status: 'unverified' });
    res.json({ message: 'Deleted unverified users.' });
  } catch (e) { res.status(500).json({ message: 'Delete unverified failed.' }); }
});
router.get('/users/non-current', async (req, res) => {
  try {
    const currentAdminId = req.user._id;
    const users = await User.find(
      { _id: { $ne: currentAdminId } }, 
      'name email status lastLogin createdAt'
    ).sort({ lastLogin: -1 });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch non-current users.' });
  }
});

module.exports = router;
