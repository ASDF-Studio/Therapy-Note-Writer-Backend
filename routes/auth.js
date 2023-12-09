const express = require('express');
const { protect } = require('../middleware/auth');
const router = express.Router();

const {
    register,
    login,
    logout,
    getRefreshToken,
    getSubscription,
    getCustomer,
    click,
    updatePassword,
    checkSubscription,
    resetPassword,
    verifyOTP,
    updateUser,
    getLinkedinUserEmail,
    getClickDataofCurrentMonth,
} = require('../controllers/auth');

router.post('/register', register);
router.post('/verify', verifyOTP);
router.post('/update', updateUser);
router.post('/login', login);
router.post('/logout', logout);
router.get('/refresh-token', getRefreshToken);
router.get('/subscription', protect, getSubscription);
router.get('/check-subscription/:id', checkSubscription);
router.get('/customer', protect, getCustomer);
router.post('/click', click);
router.get('/clickDataofCurrentMonth/:email', getClickDataofCurrentMonth);
router.post('/updatePassword', updatePassword);
router.post('/resetPassword', resetPassword);
router.post('/getLinkedinUserEmail', getLinkedinUserEmail);

module.exports = router;
