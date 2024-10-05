import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    CircularProgress,
    Container,
    Typography,
    Paper,
  } from '@mui/material';

  const Professors = () => {
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchProfessors = async () => {
        try {
          const response = await axios.get('/azure/professors');
          const data = response.data;
  
          // Sort professors by average score, descending
          const sortedProfessors = data.sort((a, b) => b.avgScore - a.avgScore);
  
          setProfessors(sortedProfessors);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching professors:', error);
          setError('Error fetching data. Please try again later.');
          setLoading(false);
        }
      };
  
      fetchProfessors();
    }, []);
  
    if (loading) {
      return (
        <Container>
          <CircularProgress />
          <Typography>Loading Professors Rankings...</Typography>
        </Container>
      );
    }
  
    if (error) {
      return (
        <Container>
          <Typography color="error">{error}</Typography>
        </Container>
      );
    }
  
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Professors Rankings
        </Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Professor Name</TableCell>
                <TableCell>Average Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {professors.map((professor, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{professor.name}</TableCell>
                  <TableCell>{professor.avgScore.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    );
  };
  
  export default Professors;