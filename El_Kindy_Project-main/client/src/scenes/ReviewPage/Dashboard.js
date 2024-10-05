import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  IconButton,
  Divider,
  Stack, 
  Badge 
} from '@mui/material';
import { Menu as MenuIcon, Star as StarIcon, Home, Info } from '@mui/icons-material';
import axios from 'axios';

import Professors from './Review';
import InstructorPieChart from './InstructerChart';

const NavigationDrawer = ({ open, onClose }) => (
  <Drawer anchor="left" open={open} onClose={onClose}>
    <List>
      <ListItem button onClick={onClose}>
        <ListItemIcon><Home /></ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button>
        <ListItemIcon><StarIcon /></ListItemIcon>
        <ListItemText primary="Top Instructors" />
      </ListItem>
      <ListItem button>
        <ListItemIcon><Info /></ListItemIcon>
        <ListItemText primary="About" />
      </ListItem>
    </List>
    <Divider />
  </Drawer>
);

const ProfessorCard = ({ topInstructor }) => (
  <Card raised>
    <CardContent>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Professors />
        </Grid>
        {topInstructor && (
          <Grid item xs={12}>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
              <Badge badgeContent="Top" color="primary">
                <IconButton aria-label="top instructor" size="large">
                  <StarIcon style={{ color: 'gold' }} />
                </IconButton>
              </Badge>
              <Typography variant="subtitle1" style={{ marginLeft: '10px' }}>
                Congratulations! Top Instructor: {topInstructor.name}
              </Typography>
            </div>
          </Grid>
        )}
      </Grid>
    </CardContent>
  </Card>
);

const InsightsCard = () => (
  <Card>
    <CardContent>
      <Typography variant="h6">Insights</Typography>
      <InstructorPieChart />
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [topInstructor, setTopInstructor] = useState(null);

  useEffect(() => {
    const fetchTopInstructor = async () => {
      try {
        const response = await axios.get('/azure/professors');
        setTopInstructor(response.data[0]);
      } catch (error) {
        console.error('Error fetching top instructor:', error);
      }
    };

    fetchTopInstructor();
  }, []);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Instructor Dashboard
          </Typography>
        
        </Toolbar>
      </AppBar>
      <NavigationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <Container>
        <Box mt={4}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <ProfessorCard topInstructor={topInstructor} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InsightsCard />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default Dashboard;
