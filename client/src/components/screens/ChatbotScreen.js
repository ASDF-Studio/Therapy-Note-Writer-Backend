import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Card,
} from '@mui/material';

import axios from 'axios';


const TherapyNoteWriter = () => {

// State variables
const [loading, setLoading] = useState(false);
const [buttonText, setButtonText] = useState('Submit');
const [loadingImageVisible, setLoadingImageVisible] = useState(false);
const [clientPronouns, setClientPronouns] = useState([]);
const [apptLocation, setApptLocation] = useState('');
const [diagnosis, setDiagnosis] = useState('');
const [currentSymptoms, setCurrentSymptoms] = useState('');
const [discussed, setDiscussed] = useState('');
const [interventions, setInterventions] = useState('');
const [appearance, setAppearance] = useState([]);
const [speech, setSpeech] = useState([]);
const [affect, setAffect] = useState([]);
const [mood, setMood] = useState([]);
const [behavior, setBehavior] = useState([]);
const [delusion, setDelusion] = useState([]);
const [suicidal, setSuicidal] = useState([]);
const [homicidal, setHomicidal] = useState([]);
const [selfInjury, setSelfInjury] = useState([]);
const [selfInjuryDescr, setSelfInjuryDescr] = useState('');
const [insight, setInsight] = useState([]);
const [judgment, setJudgment] = useState([]);
const [oriented, setOriented] = useState([]);
const [eyeContact, setEyeContact] = useState([]);
const [homework, setHomework] = useState('');
const [plan, setPlan] = useState('');
const [nextAppt, setNextAppt] = useState('');
const [summary, setSummary] = useState('');
const images = [
  'https://i.pinimg.com/236x/4c/b3/ac/4cb3acfd4b49493fd11578af6be1a9f2.jpg',
  'https://as1.ftcdn.net/v2/jpg/03/41/33/92/1000_F_341339252_zHPAjuN4jiS3VuAZfl8CSXF8LottD022.jpg',
  'https://i.pinimg.com/originals/ac/36/2f/ac362ff486d8cffb9f2dd49184fee23c.png',
  // ... additional image URLs ...
];
const [currentImage, setCurrentImage] = useState(null);


// Helper functions


const selectRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * images.length);
  setCurrentImage(images[randomIndex]);
};


const handleMultiSelectChange = (event, setter) => {
  setter(event.target.value);
};

const handleInputChange = (event, setter) => {
  setter(event.target.value);
};

const handleSubmit = async () => {
  // Set the loading state
  setLoading(true);
  // Change the button text
  setButtonText('Working on it..');
  // Show the loading image
  setLoadingImageVisible(true);
  // Select a random image to display
  selectRandomImage();

  const getValue = (label, value) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? `${label}: ${value.join(', ')}` : '';
    } else {
      return (value !== null && value !== '') ? `${label}: ${value}` : '';
    }
  };

  const newSummary = [
    getValue('Client Pronouns', clientPronouns),
    getValue('Appointment Location', apptLocation),
    getValue('Diagnosis', diagnosis),
    getValue('Current Symptoms', currentSymptoms),
    getValue('Discussed', discussed),
    getValue('Interventions', interventions),
    getValue('Appearance', appearance),
    getValue('Speech', speech),
    getValue('Affect', affect),
    getValue('Mood', mood),
    getValue('Behavior', behavior),
    getValue('Delusions', delusion),
    getValue('Suicidal Ideation', suicidal),
    getValue('Homicidal Ideation', homicidal),
    getValue('Self-Injuring Behavior', selfInjury),
    getValue('Self-Injury Description', selfInjuryDescr),
    getValue('Insight', insight),
    getValue('Judgment', judgment),
    getValue('Oriented', oriented),
    getValue('Eye Contact', eyeContact),
    getValue('Homework', homework),
    getValue('Plan for next session', plan),
    getValue('Next Appointment Date', nextAppt)
  ]
    .filter(line => line)
    .join('\n');

  const prompt = `Please write a therapy note based on the following session information:\n${newSummary}`;

  axios
    .post('http://localhost:4242/api/openai/summary', { prompt: prompt }) // Update this line
    .then((response) => {
      // Extract the data from the server response
      const note = response.data.note; // or .paragraph, depending on which API you're calling
      // Update the state of summary
      setSummary(note);
      // Reset the button text
      setButtonText('Submit');
      // Hide the loading image
      setLoadingImageVisible(false);
      // Reset the loading state
      setLoading(false);
    })
    .catch((error) => {
      console.error(`Failed to generate therapy note: ${error}`);
      setSummary('Unable to generate therapy note. Please try again later.');
      // Reset the button text
      setButtonText('Submit');
      // Hide the loading image
      setLoadingImageVisible(false);
      // Reset the loading state
      setLoading(false);
    });
};
  return (
    <Container>
      <Grid container spacing={3} style={{ height: '100vh' }}>
        <Grid item xs={12} md={5}>
          <Box component="form">
          <Typography variant="h4" gutterBottom>
          Therapy Note Writer
        </Typography>

        {/* D (Data) section */}
        <Typography variant="h5" gutterBottom>
          Session Description
        </Typography>

        <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
          <InputLabel sx={{ mt: -1 }}>Client Pronouns</InputLabel>
          <Select
            multiple
            value={clientPronouns}
            onChange={(event) => handleMultiSelectChange(event, setClientPronouns)}
          >
            {['She', 'He', 'They', 'Her', 'Him', 'Them', 'Hers', 'His', 'Theirs'].map((pronoun) => (
              <MenuItem key={pronoun} value={pronoun}>
                {pronoun}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
          <InputLabel sx={{ mt: -1 }}>Appointment Location</InputLabel>
          <Select
            value={apptLocation}
            onChange={(event) => handleInputChange(event, setApptLocation)}
          >
            {['In Person', 'Telehealth'].map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box mt={3} mb={3}>
            <TextField fullWidth label="Diagnosis" value={diagnosis} onChange={(event) => handleInputChange(event, setDiagnosis)} InputLabelProps={{sx: { mt: -1 },}}/>
        </Box>
        <Box mt={3} mb={3}>
            <TextField fullWidth label="Current Symptoms" value={currentSymptoms} onChange={(event) => handleInputChange(event, setCurrentSymptoms)} InputLabelProps={{sx: { mt: -1 },}}/>
        </Box>
        <Box mt={3} mb={3}>
            <TextField fullWidth label="What was discussed in session" value={discussed} onChange={(event) => handleInputChange(event, setDiscussed)} InputLabelProps={{sx: { mt: -1 },}}/>
        </Box>
        <Box mt={3} mb={3}>
            <TextField fullWidth label="Interventions used" value={interventions} onChange={(event) => handleInputChange(event, setInterventions)} InputLabelProps={{sx: { mt: -1 },}}/>
        </Box>
            {/* A (Assessment) section */}
    <Typography variant="h5" gutterBottom>
      Mental Status Exam
    </Typography>
    {/* Appearance */}
    <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
    <InputLabel sx={{ mt: -1 }}>Appearance</InputLabel>
    <Select
        multiple
        value={appearance}
        onChange={(event) => handleInputChange(event, setAppearance)}
    >
        {['Well-groomed', 'Disheveled', 'Appropriate', 'Inappropriate'].map((option) => (
        <MenuItem key={option} value={option}>
            {option}
        </MenuItem>
        ))}
    </Select>
    </FormControl>

    {/* Speech */}
    <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
    <InputLabel sx={{ mt: -1 }}>Speech</InputLabel>
    <Select
        multiple
        value={speech}
        onChange={(event) => handleInputChange(event, setSpeech)}
    >
        {['Clear', 'Soft', 'Loud', 'Pressured', 'Slow', 'Rapid', 'Slurred'].map((option) => (
        <MenuItem key={option} value={option}>
            {option}
        </MenuItem>
        ))}
    </Select>
    </FormControl>

    {/* Affect */}
    <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
    <InputLabel sx={{ mt: -1 }}>Affect</InputLabel>
    <Select
        multiple
        value={affect}
        onChange={(event) => handleInputChange(event, setAffect)}
    >
        {['Appropriate', 'Blunted', 'Flat', 'Labile', 'Restricted'].map((option) => (
        <MenuItem key={option} value={option}>
            {option}
        </MenuItem>
        ))}
    </Select>
    </FormControl>

    {/* Mood */}
    <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
    <InputLabel sx={{ mt: -1 }}>Mood</InputLabel>
    <Select
        multiple
        value={mood}
        onChange={(event) => handleInputChange(event, setMood)}
    >
        {['Happy', 'Sad', 'Angry', 'Irritable', 'Euphoric', 'Anxious', 'Depressed'].map((option) => (
        <MenuItem key={option} value={option}>
            {option}
        </MenuItem>
        ))}
    </Select>
    </FormControl>

    {/* Behavior */}
    <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
    <InputLabel sx={{ mt: -1 }}>Behavior</InputLabel>
    <Select
        multiple
        value={behavior}
        onChange={(event) => handleInputChange(event, setBehavior)}
    >
        {['Cooperative', 'Uncooperative', 'Agitated', 'Calm', 'Disruptive'].map((option) => (
        <MenuItem key={option} value={option}>
            {option}
        </MenuItem>
        ))}
    </Select>
    </FormControl>

    {/* Delusions */}
    <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
    <InputLabel sx={{ mt: -1 }}>Delusions</InputLabel>
    <Select
        multiple
        value={delusion}
        onChange={(event) => handleInputChange(event, setDelusion)}
    >
        {['None', 'Persecutory', 'Grandiose', 'Somatic', 'Erotomanic', 'Nihilistic'].map((option) => (
        <MenuItem key={option} value={option}>
            {option}
        </MenuItem>
        ))}
    </Select>
    </FormControl>

    {/* Suicidal Ideation */}
    <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
    <InputLabel sx={{ mt: -1 }}>Suicidal Ideation</InputLabel>
    <Select
        multiple
        value={suicidal}
        onChange={(event) => handleInputChange(event, setSuicidal)}
    >
        {['None', 'Passive', 'Active', 'Plan', 'Intent'].map((option) => (
        <MenuItem key={option} value={option}>
            {option}
        </MenuItem>
        ))}
    </Select>
    </FormControl>
    {/* Homicidal Ideation */}
    <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
    <InputLabel sx={{ mt: -1 }}>Homicidal Ideation</InputLabel>
    <Select
        multiple
        value={homicidal}
        onChange={(event) => handleInputChange(event, setHomicidal)}
    >
        {['None', 'Passive', 'Active', 'Plan', 'Intent'].map((option) => (
        <MenuItem key={option} value={option}>
            {option}
        </MenuItem>
        ))}
    </Select>
    </FormControl>

    {/* Self-Injuring Behavior */}
    <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
    <InputLabel sx={{ mt: -1 }}>Self-Injuring Behavior</InputLabel>
    <Select
        multiple
        value={selfInjury}
        onChange={(event) => handleInputChange(event, setSelfInjury)}
    >
        {['None', 'Scratching', 'Cutting', 'Burning', 'Biting', 'Other'].map((option) => (
        <MenuItem key={option} value={option}>
            {option}
        </MenuItem>
        ))}
    </Select>
    </FormControl>
    <Box mt={3} mb={3}><TextField
    fullWidth
    label="Describe self-injuring behavior (if any)"
    value={selfInjuryDescr}
    onChange={(event) => handleInputChange(event, setSelfInjuryDescr)} InputLabelProps={{sx: { mt: -1 },}}/>
    </Box>
    {/* Insight */}
    <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
    <InputLabel sx={{ mt: -1 }}>Insight</InputLabel>
    <Select
        multiple
        value={insight}
        onChange={(event) => handleInputChange(event, setInsight)}
    >
        {['Good', 'Fair', 'Poor', 'None'].map((option) => (
        <MenuItem key={option} value={option}>
            {option}
        </MenuItem>
        ))}
    </Select>
    </FormControl>

    {/* Judgment */}
    <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
    <InputLabel sx={{ mt: -1 }}>Judgment</InputLabel>
    <Select
        multiple
        value={judgment}
        onChange={(event) => handleInputChange(event, setJudgment)}
    >
        {['Good', 'Fair', 'Poor', 'None'].map((option) => (
        <MenuItem key={option} value={option}>
            {option}
        </MenuItem>
        ))}
    </Select>
    </FormControl>

    {/* Oriented */}
    <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
    <InputLabel sx={{ mt: -1 }}>Oriented</InputLabel>
    <Select
        multiple
        value={oriented}
        onChange={(event) => handleInputChange(event, setOriented)}
    >
        {['Oriented x3', 'Confused', 'Disoriented'].map((option) => (
        <MenuItem key={option} value={option}>
            {option}
        </MenuItem>
        ))}
    </Select>
    </FormControl>

    {/* Eye Contact */}
    <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
    <InputLabel sx={{ mt: -1 }}>Eye Contact</InputLabel>
    <Select
        multiple
        value={eyeContact}
        onChange={(event) => handleInputChange(event, setEyeContact)}
    >
        {['Good', 'Fair', 'Poor', 'None'].map((option) => (
        <MenuItem key={option} value={option}>
            {option}
        </MenuItem>
        ))}
    </Select>
    </FormControl>



    {/* P (Plan) section */}
    <Typography variant="h5" gutterBottom>
      Plan
    </Typography>

    <Box mt={3} mb={3}>
        <TextField fullWidth label="Homework" value={homework} onChange={(event) => handleInputChange(event, setHomework)} InputLabelProps={{sx: { mt: -1 },}}/>
    </Box>
    <Box mt={3} mb={3}>
        <TextField fullWidth label="Plan for next session" value={plan} onChange={(event) => handleInputChange(event, setPlan)} InputLabelProps={{sx: { mt: -1 },}}/>
    </Box>
    <Box mt={3} mb={3}>
        <TextField fullWidth label="Next Appointment Date" value={nextAppt} onChange={(event) => handleInputChange(event, setNextAppt)} InputLabelProps={{sx: { mt: -1 },}}/>
    </Box>
          </Box>
          </Grid>
        <Grid item xs={12} md={7} className="right-side">
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            height="100%"
            position="sticky"
            top={0}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              endIcon={loading && currentImage && <CircularProgress size={24} />}
            >
              {buttonText}
            </Button>
            <div>
              {loading && currentImage && (
                <img src={currentImage} alt="loading" />
              )}
              {summary && (
                <Card
                  sx={{
                    mt: 4,
                    p: 2,
                    border: 1,
                    boxShadow: 0,
                    borderColor: 'neutral.medium',
                    borderRadius: 2,
                    height: '500px',
                    bgcolor: 'background.default',
                  }}
                >
                  <Typography>{summary}</Typography>
                </Card>
              )}
              {!summary && !loading && (
                <Card
                  sx={{
                    mt: 4,
                    p: 2,
                    border: 1,
                    boxShadow: 0,
                    borderColor: 'neutral.medium',
                    borderRadius: 2,
                    height: '500px',
                    bgcolor: 'background.default',
                  }}
                >
                  <Typography
                    variant="h3"
                    color="neutral.main"
                    sx={{
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      lineHeight: '450px',
                    }}
                  >
                    Summary will appear here
                  </Typography>
                </Card>
              )}
            </div>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
export default TherapyNoteWriter;
