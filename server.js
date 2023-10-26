// require('dotenv').config({ path: './config.env' });
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');

const stripe = require('stripe')(process.env.APPSETTING_STRIPE_SECRET);
const User = require('./models/User'); // Replace with the path to your User model

const app = express();

mongoose.set('strictQuery', true);
mongoose.connect(
    process.env.APPSETTING_MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) throw err;
        console.log('Connected to MongoDB!!!');
    }
);

let rawBodySaver = function (req, res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
};

app.use(
    cors({
        origin: process.env.APPSETTING_CLIENT_URL, // replace with your client app URL
        methods: ['GET', 'POST', 'OPTIONS'], // allow OPTIONS method for preflight requests
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true, // allow cookies to be sent with requests from the client
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method == 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }

    next();
});

app.use(cookieParser());
app.use(bodyParser.json({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/openai', require('./routes/openai'));
app.use('/api/stripe', require('./routes/stripe'));

// Your Stripe Webhook endpoint
const endpointSecret = process.env.APPSETTING_STRIPE_WEBHOOK_SECRET;

app.post(
    '/api/stripe/webhook',
    express.raw({ type: 'application/json' }),
    async (request, response) => {
        const sig = request.headers['stripe-signature'];

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                request.body,
                sig,
                endpointSecret
            );
        } catch (err) {
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        // Log the entire event object
        // console.log(event);

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;

                // Extract the necessary data
                const customerEmail = session.customer_details.email; // Modify as per your webhook data structure
                const subscriptionId = session.subscription; // Modify as per your webhook data structure

                // Find the user in your database
                const user = await User.findOne({ email: customerEmail });

                if (!user) {
                    console.error(
                        `User with email ${customerEmail} not found.`
                    );
                    break;
                }

                // Update the user with the subscriptionId
                user.stripeSubscriptionId = subscriptionId; // Replace 'stripeSubscriptionId' with the field in your User model where you want to store the subscription id
                await user.save();

                console.log(
                    `User with email ${customerEmail} subscribed with id ${subscriptionId}.`
                );
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        response.send();
    }
);

// Use the errorHandler middleware after the routes
app.use(errorHandler);

const port = process.env.PORT || 4242;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', function (req, res) {
    return res.status(200).send({
        messsage: 'everything is working fine.',
        host: req.get('host'),
    });
});

const node_env = process.env.APPSETTING_NODE_ENV;

if (node_env === 'production') {
    app.use(express.static('./client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}
