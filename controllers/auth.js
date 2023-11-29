const User = require('../models/User');
const Click = require('../models/click');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedJwtToken(res);
    res.status(statusCode).json({ success: true, token });
    // res.cookie('access_token', token.accessToken)
    //     .status(201)
    //     .json({ user: user });
};

const generateVerificationCode = () => {
    return Math.floor(10000 + Math.random() * 89999);
};

// exports.register = async (req, res, next) => {
//     const { username, email, password } = req.body;

//     const existing_email = await User.findOne({ email });

//     if (existing_email) {
//         return next(new ErrorResponse('Email already is in use', 400));
//     }

//     try {
//         const user = await User.create({ username, email, password });
//         // sendToken(user, 201, res);
//         res.status(201).json({ user: user });
//     } catch (err) {
//         next(err);
//     }
// };

exports.register = async (req, res, next) => {
    const { email, signupMedium } = req.body;

    const existing_email = await User.findOne({ email });

    if (existing_email) {
        return next(new ErrorResponse('Email already is in use', 400));
    }

    // let otp = generateVerificationCode();
    let otp = 11111;
    const currentTime = new Date();
    const tokenExpiration = 125;
    let otpExpire = currentTime.setSeconds(
        currentTime.getSeconds() + tokenExpiration
    );

    try {
        const user = await User.create({ email, otp, otpExpire, signupMedium });

        // If login from SSO
        if (signupMedium !== 'manual') {
            await User.findOneAndUpdate(
                { email: email },
                {
                    otpVerified: true,
                }
            ).catch((err) => {
                next(err);
            });
        }
        // sendToken(user, 201, res);
        // res.status(201).json({ user: user });
        res.status(201).json({ success: true, message: 'Success' });
    } catch (err) {
        next(err);
    }
};

exports.verifyOTP = async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(
            new ErrorResponse('Please provide an email and/or otp', 400)
        );
    }

    try {
        //check that user already exists by email
        const user = await User.findOne({ email }).select('+otp');
        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        //check that password matches
        const isMatch = user.otp === otp;
        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }
        await User.findOneAndUpdate(
            { email: email },
            {
                otpVerified: true,
            }
        );

        // sendToken(user, 200, res);
        // res.status(200).json({ user: user });
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error during login:', err); // Log the error
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    let {
        email,
        password,
        username,
        noteTakingPreference,
        avgNumOfSessionsPerWeek,
        signupCompleted,
    } = req.body;

    if (!email || !password) {
        return next(
            new ErrorResponse('Please provide valid email and/or password', 400)
        );
    }

    const salt = await bcrypt.genSalt(10);
    newPasswordHashed = await bcrypt.hash(password, salt);

    try {
        //check that user already exists by email

        const user = await User.findOne({ email });

        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        await User.findOneAndUpdate(
            { email: email },
            {
                password: newPasswordHashed,
                username: username,
                noteTakingPreference: noteTakingPreference,
                avgNumOfSessionsPerWeek: avgNumOfSessionsPerWeek,
                signupCompleted: signupCompleted,
            }
        );
        res.status(201).json({ success: true });
        // res.status(201).json({ user: user });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const { email, password, signupMedium } = req.body;

    if (!email || !password) {
        return next(
            new ErrorResponse('Please provide an email and/or password', 400)
        );
    }

    try {
        //check that user already exists by email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        //check that password matches
        const isMatch = await user.matchPasswords(password);
        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        if (user.signupMedium !== signupMedium) {
            return next(new ErrorResponse('No user found with this info', 400));
        }

        // sendToken(user, 200, res);
        res.status(200).json({ user: user });
    } catch (err) {
        console.error('Error during login:', err); // Log the error
        next(err);
    }
};

exports.logout = (req, res) => {
    res.clearCookie('refreshToken');
    return res.status(200).json({ success: true, message: 'Logged out' });
};

exports.getRefreshToken = async (req, res, next) => {
    try {
        const getToken = req.cookies.refreshToken;

        if (getToken) {
            const token = jwt.verify(
                getToken,
                process.env.APPSETTING_JWT_REFRESH_SECRET
            );
            const accessToken = jwt.sign(
                { id: token.id },
                process.env.APPSETTING_JWT_ACCESS_SECRET,
                { expiresIn: process.env.APPSETTING_JWT_ACCESS_EXPIRE }
            );
            res.status(200).json(accessToken);
        }
    } catch (err) {
        return next(err);
    }
};

exports.getSubscription = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ subscription: user.subscription });
    } catch (err) {
        next(err);
    }
};

exports.getCustomer = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ customerId: user.customerId });
    } catch (err) {
        next(err);
    }
};

exports.checkSubscription = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new ErrorResponse('Please provide user id', 400));
        }
        const user = await User.findById(id);
        res.status(200).json({
            nextBill: user.nextBill,
            subPackage: user.subPackage,
        });
    } catch (err) {
        next(err);
    }
};

exports.click = async (req, res, next) => {
    const { email, month } = req.body;

    try {
        await Click.findOneAndUpdate(
            { email: email, month: month },
            { $inc: { ClickCount: 1 } },
            { upsert: true }
        );
        res.status(201).json({ success: true });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

exports.updatePassword = async (req, res, next) => {
    let { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
        return next(
            new ErrorResponse('Please provide valid email and/or password', 400)
        );
    }

    const salt = await bcrypt.genSalt(10);
    newPasswordHashed = await bcrypt.hash(newPassword, salt);

    try {
        //check that user already exists by email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        //check that password matches
        const isMatch = await user.matchPasswords(oldPassword);
        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        await User.findOneAndUpdate(
            { email: email },
            { password: newPasswordHashed }
        );
        res.status(201).json({ success: true });
    } catch (err) {
        next(err);
    }
};

exports.resetPassword = async (req, res, next) => {
    let { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
        return next(
            new ErrorResponse('Please provide valid email and/or password', 400)
        );
    }

    const salt = await bcrypt.genSalt(10);
    newPasswordHashed = await bcrypt.hash(newPassword, salt);

    try {
        //check that user already exists by email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        //check that password matches
        const isMatch = await user.matchPasswords(oldPassword);
        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        await User.findOneAndUpdate(
            { email: email },
            { password: newPasswordHashed }
        );
        res.status(201).json({ success: true });
    } catch (err) {
        next(err);
    }
};
