import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDown';

function AdminPanel({ userId }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [editData, setEditData] = useState({ open: false, id: null, type: '', title: '', description: '' });

  useEffect(() => {
    fetchFeedbacks();
    fetchIssues();
  }, []);

  const fetchFeedbacks = async () => {
    const response = await fetch(`http://localhost:3000/api/feedback?userId=${userId}`);
    const data = await response.json();
    setFeedbacks(data);
  };

  const fetchIssues = async () => {
    const response = await fetch(`http://localhost:3000/api/issues?userId=${userId}`);
    const data = await response.json();
    setIssues(data);
  };

  const handleApprove = async (id, type) => {
    await fetch(`http://localhost:3000/api/${type}/${id}/approve?userId=${userId}`, { method: 'POST' });
    type === 'feedback' ? fetchFeedbacks() : fetchIssues();
  };

  const handleDeny = async (id, type) => {
    await fetch(`http://localhost:3000/api/${type}/${id}/deny?userId=${userId}`, { method: 'POST' });
    type === 'feedback' ? fetchFeedbacks() : fetchIssues();
  };

  const openEditDialog = (item, type) => {
    setEditData({ open: true, ...item, type });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmitEdit = async () => {
    const { id, type, title, description } = editData;
    await fetch(`http://localhost:3000/api/${type}/${id}?userId=${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    setEditData({ open: false, id: null, type: '', title: '', description: '' });
    type === 'feedback' ? fetchFeedbacks() : fetchIssues();
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Feedbacks</h3>
      <List>
        {feedbacks.map((feedback) => (
          <ListItem key={feedback.id} secondaryAction={
            <>
              <Button onClick={() => handleApprove(feedback.id, 'feedback')}><ThumbUpAltIcon /></Button>
              <Button onClick={() => handleDeny(feedback.id, 'feedback')}><ThumbDownAltIcon /></Button>
              <Button onClick={() => openEditDialog(feedback, 'feedback')}><EditIcon /></Button>
            </>
          }>
            <ListItemText primary={feedback.title} secondary={`Status: ${feedback.status}`} />
          </ListItem>
        ))}
      </List>
      <h3>Issues</h3>
      <List>
        {issues.map((issue) => (
          <ListItem key={issue.id} secondaryAction={
            <>
              <Button onClick={() => handleApprove(issue.id, 'issue')}><ThumbUpAltIcon /></Button>
              <Button onClick={() => handleDeny(issue.id, 'issue')}><ThumbDownAltIcon /></Button>
              <Button onClick={() => openEditDialog(issue, 'issue')}><EditIcon /></Button>
            </>
          }>
            <ListItemText primary={issue.title} secondary={`Status: ${issue.status}`} />
          </ListItem>
        ))}
      </List>
      <Dialog open={editData.open} onClose={() => setEditData({ open: false, id: null, type: '', title: '', description: '' })}>
        <DialogTitle>Edit {editData.type.toUpperCase()}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Title" fullWidth variant="outlined" name="title" value={editData.title} onChange={handleEditChange} />
          <TextField margin="dense" label="Description" fullWidth variant="outlined" name="description" value={editData.description} onChange={handleEditChange} multiline rows={4} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmitEdit}>Save Changes</Button>
          <Button onClick={() => setEditData({ open: false, id: null, type: '', title: '', description: '' })}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdminPanel;
