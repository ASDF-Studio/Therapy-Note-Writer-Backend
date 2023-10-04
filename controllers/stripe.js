const User = require('../models/User');
const stripe = require('stripe')(process.env.APPSETTING_STRIPE_SECRET);
const DOMAIN = "http://localhost:3000";

exports.createCheckout = async (req, res) => {
  const { priceId, sub } = req.body;
  
  try {
    // Log the user id here
    console.log(`Storing user ID in session metadata: ${req.user._id}`);
    
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        }
      ],
      metadata: {
        user_id: String(req.user._id), // Ensuring it's a string might be helpful depending on how your ID is structured
        subscription: sub
      },
      success_url: `${DOMAIN}/chatbot`,
      cancel_url: `${DOMAIN}/`,
      automatic_tax: { enabled: true },
    });
    res.status(200).json(session);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}

exports.createPortal = async (req, res) => {
  const { customerId } = req.body;
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${DOMAIN}/`,
    });
    res.status(200).json(portalSession);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}

exports.createWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.APPSETTING_STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("checkout session completed");
    const session = event.data.object;
    const user_id = session.metadata.user_id;
        
    // Log the user id here
    console.log(`Retrieved user ID from session metadata: ${user_id}`);

    const customerId = session.customer;
    const subscription = session.subscription;
      
    console.log(`Session: ${JSON.stringify(session)}`);
    console.log(`User ID: ${user_id}`);
    console.log(`Customer ID: ${customerId}`);
    console.log(`Subscription: ${subscription}`);
      
    try {
      const updatedUser = await User.updateOne(
        { _id: user_id },
        {
          $set: {
            customerId: customerId,
            subscription: subscription,
          }
        }
      );
      console.log(`Updated User: ${JSON.stringify(updatedUser)}`);
      res.json({ received: true });
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      return res.status(500).send(`Webhook Error: ${err.message}`);
    }
  } else {
    res.json({ received: true });
  }
}
