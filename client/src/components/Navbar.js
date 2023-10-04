import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Link, Typography, useTheme, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Alert } from '@mui/material';
import axios from 'axios';

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("authToken") ? true : false);
  const [subscription, setSubscription] = useState(localStorage.getItem("sub") ? true : false);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkRefresh = async () => {
      try {
        const token = await axios.get("/api/auth/refresh-token");
        if (!token.data) {
          localStorage.removeItem("authToken");
          setLoggedIn(false);
        } else {
          const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token.data}` } };
          const subscription = await axios.get("/api/auth/subscription", config).then(res => res.data.subscription);
          localStorage.setItem("sub", subscription);
          setSubscription(subscription ? true : false);
          setLoggedIn(true);
        }
      } catch (err) {
        console.log(err);
      }
    };

    checkRefresh();
  }, []);

  const logoutHandler = async () => {
    try {
      await axios.post("/api/auth/logout");
      fullyLogout();
    } catch (err) {
      console.log(err);
    }
  };

  const fullyLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("sub");
    setLoggedIn(false);
    setSubscription(false);
    window.location.reload();
  };

  const createPortal = async () => {
    try {
      const token = await axios.get("/api/auth/refresh-token");
      if (token.data) {
        const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token.data}` } };
        const customerId = await axios.get("/api/auth/customer", config);
        if (customerId.data.customerId) {
          const portal = await axios.post("/api/stripe/portal", { customerId: customerId.data.customerId }, config);
          if (portal.data.url) {
            window.open(portal.data.url, "_self");
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (localStorage.getItem("authToken")) {
        try {
            const token = await axios.get("/api/auth/refresh-token");
            if (token.data) {
                const config = {headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token.data}` } };
                const sub = await axios.get("/api/auth/subscription", config);
                if (sub.data.subscription) {
                    navigate("/chatbot") // If user is already subscribed, navigate to /chatbot.
                } else {
                    const session = await axios.post("/api/stripe/checkout", {priceId: "price_1NF1byCUsSr2i6mqfbCF7RLC", sub: "normal"}, config);
                    if (session.data) {
                        window.open(session.data.url, "_self");
  
                        // Start a poll to check the payment status of the checkout session every 5 seconds
                        const checkPaymentStatusInterval = setInterval(async () => {
                          const sessionId = session.data.id;
                          const paymentStatus = await axios.get(`/api/stripe/checkout-session/${sessionId}`, config);
                          if (paymentStatus.data.payment_status === 'paid') {
                            clearInterval(checkPaymentStatusInterval);
                            // Update the subscription status in local storage
                            localStorage.setItem("sub", 'paid');
                            navigate("/chatbot");
                          }
                        }, 5000);
                    }
                }
            }
        } catch (err) {
            if (err.response.data.message) {
                setError(err.response.data.message);
                setTimeout(() => {setError("");}, 3000);
            }
        }
    } else {
        setOpenDialog(true); // Instead of setting the error, we're opening the dialog.
    }
  }
  
  
  

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box width="100%" p="1rem 6%" backgroundColor={theme.palette.background.alt} textAlign="center" sx={{ boxShadow: 3, mb: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <Typography variant="h1" color="primary" fontWeight="bold"><Link href="/" underline="none">TherapyNoteWriter</Link></Typography>
      <Link onClick={subscription ? () => navigate("/chatbot") : handleCheckout} p={1} style={{ cursor: 'pointer' }}>Write a Note</Link>
      {loggedIn ?
        <>
          <Link onClick={createPortal} p={1} style={{ cursor: 'pointer' }}>Billing Portal</Link>
          <Link onClick={logoutHandler} p={1} style={{ cursor: 'pointer' }}>Logout</Link>
        </> :
        <>
          <Link href="/register" p={1}>Register</Link>
          <Link href="/login" p={1}>Login</Link>
        </>
      }
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Ready to get started?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Register now to begin!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { handleCloseDialog(); window.location.href = "/register"; }} color="primary">
            Register
          </Button>
          <Button onClick={() => { handleCloseDialog(); window.location.href = "/login"; }} color="primary">
            Login
          </Button>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Navbar;
