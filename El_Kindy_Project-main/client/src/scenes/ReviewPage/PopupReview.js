import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem, CircularProgress, Snackbar } from '@mui/material';
import axios from 'axios';

function ReviewPopup({ open, handleClose, teachers, selectedTeacher, setSelectedTeacher }) {
    console.log('Props in ReviewPopup:', { setSelectedTeacher });
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleReviewSubmit = (isSuccess) => {
        if (isSuccess) {
            setSnackbarOpen(true);
        }
    };
    const handleSubmit = async () => {
        const payload = {
            instructorName: `${selectedTeacher.firstName} ${selectedTeacher.lastName}`,
            text: reviewText.trim(),
        };
    
        setIsSubmitting(true);
        try {
            const response = await axios.post('/azure/analyze-sentiment', payload);
            console.log('Review Submitted:', response.data);
            setSnackbarOpen(true); 
            setTimeout(() => {
                handleClose(); 
            }, 4000); 
            setReviewText(''); 
        } catch (error) {
            console.error('Failed to submit review:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogContent>
                <TextField
                    select
                    label="Select Instructor"
                    value={selectedTeacher?._id}
                    onChange={e => {
                        const selectedId = e.target.value;
                        const teacher = teachers.find(t => t._id === selectedId);
                        if (teacher) {
                            setSelectedTeacher(teacher);
                        } else {
                            console.error('Selected teacher not found');
                        }
                    }}
                    fullWidth
                    variant="outlined"
                    margin="dense"
                >
                    {teachers.map((teacher) => (
                        <MenuItem key={teacher._id} value={teacher._id}>
                            {teacher.firstName} {teacher.lastName}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    margin="dense"
                    id="review"
                    label="Your Feedback"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary" disabled={isSubmitting || !reviewText.trim()} variant="contained">
                    {isSubmitting ? <CircularProgress size={24} /> : 'Submit Review'}
                </Button>
            </DialogActions>
            <Snackbar
    open={snackbarOpen}
    autoHideDuration={3000}
    onClose={() => {
        console.log('Closing Snackbar');
        setSnackbarOpen(false);
    }}
    message="Thank you for your review!"
/>
        </Dialog>
    );
}

export default ReviewPopup;