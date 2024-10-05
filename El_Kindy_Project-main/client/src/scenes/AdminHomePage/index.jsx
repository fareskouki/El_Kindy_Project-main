import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";

import { loadScripts } from '../../scriptLoader';

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
  Badge ,
  CardHeader,
  CardActions,
  Button
} from '@mui/material';

import { Menu as MenuIcon, Star as StarIcon, Home, Info } from '@mui/icons-material';
import axios from 'axios';

import Professors from '.././ReviewPage/Review';
import InstructorPieChart from '.././ReviewPage/InstructerChart';

const ProfessorCard = ({ topInstructor }) => (
  <Card raised sx={{
    borderRadius: 2,
    transition: '0.3s',
    borderColor: 'primary.main',
    borderWidth: 2,
    borderStyle: 'solid',
    '&:hover': {
      transform: 'translateY(-3px)', // Simple lift animation on hover
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)' // Increased shadow on hover
    }
  }}>
    <CardHeader />
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Professors />
        </Grid>
        {topInstructor && (
          <Grid item xs={12}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Badge badgeContent="Top" color="primary" overlap="rectangular">
                <IconButton aria-label="top instructor">
                  <StarIcon sx={{ color: 'gold' }} />
                </IconButton>
              </Badge>
              <Typography variant="subtitle1" sx={{ ml: 2 }}>
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
  <Card raised sx={{
    borderRadius: 2,
    transition: '0.3s',
    borderColor: 'secondary.main',
    borderWidth: 2,
    borderStyle: 'solid',
    '&:hover': {
      transform: 'scale(1.03)', // Slight scale up on hover
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)' // Increased shadow on hover
    }
  }}>
    <CardHeader title="Insights" />
    <CardContent>
      <Typography variant="h6">Performance Overview</Typography>
      <InstructorPieChart />
    </CardContent>
  </Card>
);
function Index() {
 
  const [topInstructor, setTopInstructor] = useState(null);

  useEffect(() => {
    const fetchTopInstructor = async () => {
      try {
        const response = await axios.get('/azure/professors');
        setTopInstructor(response.data[0]); // Assuming the first item is the top instructor
      } catch (error) {
        console.error('Error fetching top instructor:', error);
      }
    };

    fetchTopInstructor();
  }, []);

  return (
    <div>
      {/* Main content start */}
      <main>
        <SideBar />
        <div className="page-content">
          <TopBarBack />

          {/* Page main content START */}
          <div className="page-content-wrapper border">
            {/* Title and main content grid */}
            <div className="row">
              <div className="col-12 mb-3">
                <h1 className="h3 mb-2 mb-sm-0">Dashboard</h1>
              </div>
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
          </div>
          {/* Page main content END */}
        </div>
        {/* Page content END */}
      </main>
      {/* Main content end */}
    </div>
  );

}

export default Index;