
const express = require('express');
const { getMe, updateMe, getAddresses, setDefaultAddress, deleteAddress, getAllUsers, toggleActive, deleteUser } = require('./user.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/me', getMe);
router.patch('/me', updateMe);
router.get('/me/addresses', getAddresses);
router.post('/me/addresses', async (req, res) => { // Adding missing POST address
  const User = require('../../models/user.model');
  const user = await User.findById(req.user._id);
  user.address.push(req.body);
  await user.save();
  res.status(201).json({ data: { addresses: user.address } });
});
router.patch('/me/addresses/default', setDefaultAddress);
router.delete('/me/addresses/:id', deleteAddress);

router.use(authorize('admin'));
router.get('/', getAllUsers);
router.patch('/:id', toggleActive);
router.delete('/:id', deleteUser);

module.exports = router;
