const User = require('../models/User');
const Click = require('../models/click');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { default: axios } = require('axios');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(
    process.env.SENDGRID_API_KEY ||
        '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'
);

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

    let otp = generateVerificationCode();
    // let otp = 11111;
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
        } else {
            // using Twilio SendGrid's v3 Node.js Library
            // https://github.com/sendgrid/sendgrid-nodejs

            const msg = {
                to: email, // Change to your recipient
                from: 'admin@therapynotewriter.com', // Change to your verified sender
                subject: 'Verification | Therapy Note Write',
                // text: `DO NOT SHARE THIS WITH ANYONE. Your Therapy Note OTP is ${otp}`,
                html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                  <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #3052B5;text-decoration:none;font-weight:600">Therapy Note Writer</a>
                  </div>
                  <p style="font-size:1.1em">Hi,</p>
                  <p>Thank you for choosing Your us. Use the following OTP to complete your Sign Up procedures. DO NOT SHARE THIS WITH ANYONE.</p>
                  <h2 style="background: #3052B5;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                  <p style="font-size:0.9em;">Regards,<br />Therapy Note Writer</p>
                  <hr style="border:none;border-top:1px solid #eee" />
                  <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                    <p>Therapy Note Writer</p>
                    <p>1600 Amphitheatre Parkway</p>
                    <p>California</p>
                  </div>
                </div>
              </div>`,
            };
            sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent');
                })
                .catch((error) => {
                    console.error(error);
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
        const userCheck = await User.findOne({ email });
        if (!userCheck) {
            return next(
                new ErrorResponse(
                    'There is no user with this email. Sign up to create a user',
                    401
                )
            );
        }

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

exports.setTermsOfService = async (req, res, next) => {
    const { email } = req.body;

    try {
        await User.findOneAndUpdate(
            { email: email },
            { privacyPolicyAccepted: true }
        );
        res.status(201).json({ success: true });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

exports.getTermsOfService = async (req, res, next) => {
    const { email } = req.body;

    try {
        const result = await User.findOne({ email: email });
        res.status(201).json({
            success: true,
            privacyPolicyAccepted: result.privacyPolicyAccepted,
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

exports.getClickDataofCurrentMonth = async (req, res, next) => {
    const { email } = req.params;

    if (!email) {
        return next(new ErrorResponse('Please provide user email', 400));
    }

    const today = new Date();
    const month = `${today.getMonth()}/${today.getFullYear()}`;

    try {
        const clicks = await Click.findOne({ email: email, month: month });
        const user = await User.findOne({ email: email });

        res.status(201).json({
            success: true,
            data: {
                month: month,
                clicks: clicks,
                clickLimit: user.clickLimit,
            },
        });
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

exports.resetPasswordFromLink = async (req, res, next) => {
    let { email, series, newPassword } = req.body;

    if (!email || !series || !newPassword) {
        return next(
            new ErrorResponse('Please provide valid email and/or password', 400)
        );
    }

    const salt = await bcrypt.genSalt(10);
    newPasswordHashed = await bcrypt.hash(newPassword, salt);

    try {
        //check that user already exists by email
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        const currentDate = new Date();

        if (user.seriesExpiryDate < currentDate) {
            return next(new ErrorResponse('Reset link expired', 400));
        }

        if (user.series !== series) {
            return next(
                new ErrorResponse('Reset link expired. ErrorCode: 003', 400)
            );
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

exports.generateResePasswordLink = async (req, res, next) => {
    let { email } = req.body;

    if (!email) {
        return next(new ErrorResponse('Please provide valid email ', 400));
    }

    // series is a random string works as secret key while reseting password and it's
    // expiry date marks it's validity
    const series = (Math.random() + 1).toString(36).substring(4);
    const seriesExpiryDate = new Date();
    seriesExpiryDate.setHours(seriesExpiryDate.getHours() + 24);

    try {
        await User.findOneAndUpdate(
            { email: email },
            {
                series: series,
                seriesExpiryDate: seriesExpiryDate,
            }
        );
        res.status(201).json({ success: true });
    } catch (err) {
        next(err);
    }
};

exports.getLinkedinUserEmail = async (req, res, next) => {
    let { code, redirect_uri } = req.body;

    if (!code) {
        return next(new ErrorResponse('Please provide valid body data', 400));
    }

    try {
        const grant_type = 'authorization_code';
        // const redirect_uri = 'https://gull-equal-slowly.ngrok-free.app/signup';
        const client_id = '86z5s5j7v8ljtj';
        const client_secret = 'N7Lpk1YhmOrvaSZh';

        let header = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        let url = `https://www.linkedin.com/oauth/v2/accessToken?grant_type=${grant_type}&code=${code}&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}`;

        // Get access token
        axios
            .post(url, header)
            .then((data) => {
                const accessToken = data.data.access_token;

                let headers = {
                    Authorization: 'Bearer ' + accessToken,
                };

                url = `https://api.linkedin.com/v2/userinfo`;

                // get user info
                axios
                    .get(url, { headers })
                    .then((userData) => {
                        const email = userData.data.email;

                        res.status(201).json({ success: true, email: email });
                    })
                    .catch((err) => {
                        // console.log(err.response.data);
                        next(err);
                    });
            })
            .catch((err) => {
                next(err);
            });
    } catch (err) {
        next(err);
    }
};

exports.getFeedback = async (req, res, next) => {
    const { email, feedback, rating } = req.body;

    try {
        // using Twilio SendGrid's v3 Node.js Library
        // https://github.com/sendgrid/sendgrid-nodejs

        const msg = {
            to: 'airlystudio@gmail.com', // Change to your recipient
            from: 'admin@therapynotewriter.com', // Change to your verified sender
            subject: 'User Feedback',
            // text: `DO NOT SHARE THIS WITH ANYONE. Your Therapy Note OTP is ${otp}`,
            html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                  <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #3052B5;text-decoration:none;font-weight:600">Therapy Note Writer</a>
                  </div>
                  <p style="font-size:1.1em">User: ${email}</p>
                  <p>Rating: ${rating} star</p>
                  <p>${feedback}</p>
                  <hr style="border:none;border-top:1px solid #eee" />
                  <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                    <p>Therapy Note Writer</p>
                    <p>1600 Amphitheatre Parkway</p>
                    <p>California</p>
                  </div>
                </div>
              </div>`,
        };
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent');
            })
            .catch((error) => {
                console.error(error);
            });

        // sendToken(user, 201, res);
        // res.status(201).json({ user: user });
        res.status(201).json({ success: true, message: 'Success' });
    } catch (err) {
        next(err);
    }
};
