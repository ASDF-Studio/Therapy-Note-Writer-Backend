const User = require('../models/User');
const stripe = require('stripe')(process.env.APPSETTING_STRIPE_SECRET);
const DOMAIN = process.env.APPSETTING_CLIENT_URL;

exports.createCheckout = async (req, res) => {
    const { priceId, sub, userID, clickLimit } = req.body;

    if (sub === 'FREE') {
        try {
            let today = new Date();
            today.setMonth(today.getMonth() + 1);
            // const nextBill = today.toISOString();
            const nextBill = today.toLocaleString().split(',')[0];

            const updatedUser = await User.updateOne(
                { _id: userID },
                {
                    $set: {
                        customerId: userID,
                        subscription: 'free_subscription',
                        subPackage: sub,
                        nextBill: nextBill,
                        clickLimit: clickLimit,
                    },
                }
            );
            res.status(200).json({
                success: true,
            });
        } catch (err) {
            // console.log(err);
            res.status(500).json({ message: err.message });
        }
    } else {
        try {
            // Log the user id here

            // console.log(`Storing user ID in session metadata: ${req.user._id}`);

            const session = await stripe.checkout.sessions.create({
                billing_address_collection: 'auto',
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                metadata: {
                    user_id: String(userID), // Ensuring it's a string might be helpful depending on how your ID is structured
                    subscription: sub,
                    clickLimit: clickLimit,
                },
                mode: 'subscription',
                success_url: `${DOMAIN}/dashboard/settings?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${DOMAIN}/dashboard/settings?canceled=true`,
                // automatic_tax: { enabled: true },
            });
            // res.status(200).json(session);
            // res.redirect(303, session.url);
            res.json({ success: 2, url: session.url });
        } catch (err) {
            // console.log(err);
            res.status(500).json({ message: err.message });
        }
    }
};

exports.createPortal = async (req, res) => {
    const { customerId } = req.body;
    try {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${DOMAIN}/`,
        });
        res.status(200).json(portalSession);
    } catch (err) {
        // console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.createWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.APPSETTING_STRIPE_WEBHOOK_SECRET;
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            sig,
            endpointSecret
        );
        // console.log('event ', event);
    } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        console.log('checkout session completed');
        const session = event.data.object;
        const user_id = session.metadata.user_id;

        // Log the user id here
        console.log(`Retrieved user ID from session metadata: ${user_id}`);

        const customerId = session.customer;
        const subscription = session.subscription;
        const subPackage = session.metadata.subscription;
        const clickLimit = session.metadata.clickLimit;
        const nextBill = new Date(
            session.expires_at * 1000
        ).toLocaleDateString();

        // console.log(`Session: ${JSON.stringify(session)}`);
        // console.log(`Session: ${session.amount_total}`);
        // console.log(`Session: ${session.metadata.subscription}`);
        // console.log(`Session: ${session.metadata.clickLimit}`);
        // console.log(`User ID: ${user_id}`);
        // console.log(`Customer ID: ${customerId}`);
        // console.log(`Subscription: ${subscription}`);

        try {
            const updatedUser = await User.updateOne(
                { _id: user_id },
                {
                    $set: {
                        customerId: customerId,
                        subscription: subscription,
                        subPackage: subPackage,
                        nextBill: nextBill,
                        clickLimit: clickLimit,
                    },
                }
            );
            console.log(`Updated User: ${JSON.stringify(updatedUser)}`);
            // res.json({ received: true });
            res.send();
        } catch (err) {
            // console.log(`Webhook Error: ${err.message}`);
            return res.status(500).send(`Webhook Error: ${err.message}`);
        }
    } else {
        // res.json({ received: true });
        res.send({ received: true });
    }
};
