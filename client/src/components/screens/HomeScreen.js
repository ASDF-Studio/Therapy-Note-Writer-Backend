import React, { useState } from "react";
import { 
  Button, 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Link
} from "@mui/material";

import { styled } from "@mui/system";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';




const Root = styled(Container)(({ theme }) => ({
  flexGrow: 1,
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}));

const Headline = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
}));

const CtaButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const ImageBox = styled(Box)(({ theme }) => ({
  backgroundImage: `url("/images/office2.PNG")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: 400,
  minWidth: 400,
}));

const ListItemWithIcon = ({ iconUrl, text }) => (
  <li style={{ display: "flex", alignItems: "center", listStyle: "none", marginBottom: 8 }}>
    <img src={iconUrl} alt="" style={{ marginRight: 8 }} />
    <span>{text}</span>
  </li>
);

const HomeScreen = () => {
    //price_1NF1byCUsSr2i6mqfbCF7RLC
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const handleCheckout = async (e) => { 
        e.preventDefault();
        if (localStorage.getItem("authToken")) {
            try { 
                const token = await axios.get("/api/auth/refresh-token");
                if (token.data) {
                    const config = {headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token.data}` } };
                    const sub = await axios.get("/api/auth/subscription", config);
                    if (sub.data.subscription) { 
                        navigate("/chatbot")
                    } else {
                        const session = await axios.post("/api/stripe/checkout", {priceId: "price_1NF1byCUsSr2i6mqfbCF7RLC", sub: "normal"}, config);
                        if (session.data) {
                            window.open(session.data.url, "_self");
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
            setError("Please login to continue");
            setTimeout(() => {setError("");}, 3000);
        }
    }

    return (
      <Root>
        <Headline variant="h3" align="center" gutterBottom>
          Write progress notes effortlessly with AI generated TherapyNoteWriter
        </Headline>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box padding={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
              <Typography variant="subtitle1" align="center">
                Save valuable time, reduce documentation stress, and focus on what truly matters – delivering exceptional care to your clients.
              </Typography>
              <CtaButton variant="contained" color="primary">
              <Link href="/register" underline="none" sx={{ color: 'inherit', textDecoration: 'inherit' }}>
                Sign Up
              </Link>
            </CtaButton>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <ImageBox />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box padding={5}>
              <Typography variant="h4">Simplified note-writing process</Typography>
              <Typography variant="h5">TherapyNoteWriter in 3 simple steps</Typography>
              <ul>
                <ListItemWithIcon
                  iconUrl="/images/icon1.jpg"
                  text="Input session info - Easily enter relevant details about the therapy session."
                />
                <ListItemWithIcon
                  iconUrl="/images/icon2.jpg"
                  text="Click Generate - Our AI-powered system creates a professional progress note in DAP format."
                />
                <ListItemWithIcon
                  iconUrl="/images/icon3.jpg"
                  text="Note complete - Review, edit, and save your progress note, freeing up time for patient care."
                />
              </ul>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box padding={5}>
              <Typography variant="h4">Less time on notes, more time for patients</Typography>
              <ul>
                <li>TherapyNoteWriter generates accurate progress notes in DAP format, saving therapists time and reducing stress.</li>
                <li>Our mission is to streamline progress note writing for mental healthcare professionals.</li>
                <li>The goal is to enable therapists to focus on patient care, not note writing.</li>
              </ul>
            </Box>
          </Grid>
        </Grid>
      </Root>
    );
  };
  

export default HomeScreen;




