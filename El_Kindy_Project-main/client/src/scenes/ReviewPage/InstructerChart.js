import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { Button } from '@mui/material';
import ReviewPopup from './PopupReview';

// Define colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919', '#19FF19', '#1919FF', '#FF19FF', '#19FFFF'];

const InstructorPieChart = () => {
  const [instructorData, setInstructorData] = useState([]);


  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/azure/professors');
        const data = response.data.map((instructor) => ({
          name: instructor.name,
          value: instructor.avgScore, 
        }));
        setInstructorData(data);
       // checkLastDayOfMonth();
      } catch (error) {
        console.error('Error fetching instructor data:', error);
      }
    };

    fetchInstructorData();
  }, []);

  /* const checkLastDayOfMonth = () => {
    const today = new Date();
    console.log("Today's Date:", today); // Check the current date logged

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isLastDayOfMonth = today.getMonth() !== tomorrow.getMonth();

    console.log("Is Last Day of Month:", isLastDayOfMonth); // Check if it correctly identifies the last day

    if (isLastDayOfMonth) {
      const lastReviewDate = localStorage.getItem('lastReviewDate');
      console.log("Last Review Date:", lastReviewDate); // Check what is stored in local storage

      const lastReviewMonth = lastReviewDate ? new Date(lastReviewDate).getMonth() : -1;
      const currentMonth = today.getMonth();

      console.log("Last Review Month:", lastReviewMonth, "Current Month:", currentMonth);

      if (lastReviewMonth === null || lastReviewMonth !== currentMonth) {
        console.log("Opening Popup"); // Check if this part is reached
        setOpenPopup(true);
        localStorage.setItem('lastReviewDate', today.toISOString());
      }
    }
  }; */

  return (
    <>
    <PieChart width={400} height={400}>
      <Pie
        data={instructorData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={120}
        fill="#8884d8"
        label
      >
        {instructorData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
{/*     <ReviewPopup
        instructorName="Select Instructor" 
        open={openPopup}
        handleClose={() => setOpenPopup(false)}
      /> */}
    </>
  );
};

export default InstructorPieChart;
