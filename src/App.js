import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, List, ListItem, ListItemText, IconButton ,Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import AdminPanel from './AdminPanel';
import EditIcon from '@mui/icons-material/Edit';

const App = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [newFeedback, setNewFeedback] = useState('');
  const [newIssue, setNewIssue] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
    fetchIssues();
  }, []);

  const fetchFeedbacks = () => {
    fetch('http://localhost:3000/api/feedback')
      .then((response) => response.json())
      .then(setFeedbacks)
      .catch(console.error);
  };

  const fetchIssues = () => {
    fetch('http://localhost:3000/api/issues')
      .then((response) => response.json())
      .then(setIssues)
      .catch(console.error);
  };

  const submitFeedback = () => {
    fetch('http://localhost:3000/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId, email:email, title: newFeedback, description: newFeedback, category: 'General' }),
    })
      .then(fetchFeedbacks)
      .then(() => {
        setNewFeedback('');
        setEmail('');
        setUserId('');
      })
      .catch(console.error);
  };

  const submitIssue = () => {
    fetch('http://localhost:3000/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId, email: email, title: newIssue, description: newIssue }),
    })
      .then(fetchIssues)
      .then(() => {
        setNewIssue('');
        setEmail('');
        setUserId('');
      })
      .catch(console.error);
  };

  const vote = (requestType, requestId) => {
    fetch(`http://localhost:3000/api/votes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, requestId, requestType }),
    })
      .then(() => {
        if (requestType === 'feedback') fetchFeedbacks();
        else fetchIssues();
      })
      .catch(console.error);
  };

    // Admin actions
    // const handleAdminAction = async (action, type, id) => {
    //   await fetch(`http://localhost:3000/api/${type}/${id}/${action}`, { method: 'POST' });
    //   action !== 'edit' && fetchFeedbacks();
    //   action !== 'edit' && fetchIssues();
    // };

    // const startEdit = (type, item) => {
    //   setCurrentEdit({ type, id: item.id });
    //   setEditTitle(item.title);
    //   setEditDescription(item.description || '');
    //   setEditDialogOpen(true);
    // };
  
    // const submitEdit = async () => {
    //   await handleAdminAction('edit', currentEdit.type, currentEdit.id);
    //   setEditDialogOpen(false);
    //   fetchFeedbacks();
    //   fetchIssues();
    // };

    return (
      <Container maxWidth="sm">
        <Button onClick={() => setIsAdmin(!isAdmin)} variant="contained" color="secondary" style={{ marginTop: 20, marginBottom: 20 }}>
          {isAdmin ? 'Switch to User View' : 'Switch to Admin View'}
        </Button>
  
        {isAdmin ? (
          <AdminPanel userId={userId} />
        ) : (
          <>
            <TextField label="User ID" variant="outlined" value={userId} onChange={(e) => setUserId(e.target.value)} fullWidth margin="normal" />
            <TextField label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
            
            {/* Section for submitting new feedback */}
            <Typography variant="h6" style={{ margin: '20px 0 10px' }}>Submit New Feedback</Typography>
            <div>
              <TextField label="New Feedback" variant="outlined" value={newFeedback} onChange={(e) => setNewFeedback(e.target.value)} fullWidth margin="normal" />
              <Button onClick={submitFeedback} startIcon={<AddIcon />} variant="contained" color="primary">Add Feedback</Button>
            </div>
  
            {/* Section for submitting new issues */}
            <Typography variant="h6" style={{ margin: '20px 0 10px' }}>Submit New Issue</Typography>
            <div>
              <TextField label="New Issue" variant="outlined" value={newIssue} onChange={(e) => setNewIssue(e.target.value)} fullWidth margin="normal" />
              <Button onClick={submitIssue} startIcon={<AddIcon />} variant="contained" color="primary">Add Issue</Button>
            </div>
  
            {/* Separated listings for feedbacks and issues */}
            <Typography variant="h6" style={{ marginTop: 20 }}>Feedbacks</Typography>
            <List>
              {feedbacks.map(feedback => (
                <ListItem key={feedback.id}>
                  <ListItemText primary={feedback.title} secondary={`Votes: ${feedback.votes || 0}`} />
                  <IconButton onClick={() => vote('feedback', feedback.id)}><ThumbUpAltIcon /></IconButton>
                </ListItem>
              ))}
            </List>
  
            <Typography variant="h6" style={{ marginTop: 20 }}>Issues</Typography>
            <List>
              {issues.map(issue => (
                <ListItem key={issue.id}>
                  <ListItemText primary={issue.title} secondary={`Votes: ${issue.votes || 0}`} />
                  <IconButton onClick={() => vote('issue', issue.id)}><ThumbUpAltIcon /></IconButton>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Container>
    );
    
};

export default App;
