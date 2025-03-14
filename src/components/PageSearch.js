import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  ListItemAvatar,
  Avatar,
  IconButton, 
  Divider, 
  CircularProgress,
  Snackbar,
  Alert,
  Link
} from '@mui/material';
import { Add, Search, Info } from '@mui/icons-material';
import { facebookPageApi } from '../services/api';
import config from '../utils/config';

const PageSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm || !accessToken) {
      setError('Please enter both a search term and an access token');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const results = await facebookPageApi.searchPages(searchTerm, accessToken);
      setSearchResults(results.data || []);
      if ((results.data || []).length === 0) {
        setError('No pages found matching your search term');
      }
    } catch (err) {
      console.error('Search error:', err);
      let errorMessage = 'Error searching for pages. Please try again.';
      
      // Handle specific Graph API errors
      if (err.response?.data?.error) {
        const apiError = err.response.data.error;
        errorMessage = `Facebook API Error: ${apiError.message} (Code: ${apiError.code})`;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a page to monitor
  const handleAddPage = async (page) => {
    try {
      setLoading(true);
      await facebookPageApi.addPage({
        page_id: page.id,
        name: page.name,
        category: page.category,
        url: page.link
      });
      setSuccessMessage(`Page "${page.name}" added successfully!`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding page. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Close the success message snackbar
  const handleCloseSuccessMessage = () => {
    setSuccessMessage('');
  };

  // Close the error message snackbar
  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Facebook Pages
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box component="form" onSubmit={handleSearch} noValidate>
          <TextField
            fullWidth
            label="Search Term"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            margin="normal"
            required
            placeholder="Enter page name or keywords"
          />
          
          <TextField
            fullWidth
            label="Facebook Access Token"
            variant="outlined"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            margin="normal"
            required
            placeholder="Enter your Facebook access token"
            type="password"
            helperText={`Using Graph API version: ${config.FACEBOOK.API_VERSION}`}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            startIcon={<Search />}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Search Pages'}
          </Button>
        </Box>
      </Paper>

      {searchResults.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Search Results
          </Typography>
          
          <List>
            {searchResults.map((page, index) => (
              <React.Fragment key={page.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemAvatar>
                    <Avatar 
                      src={page.picture?.data?.url} 
                      alt={page.name}
                      sx={{ width: 50, height: 50, mr: 1 }}
                    >
                      <Info />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={page.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Category: {page.category}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          ID: {page.id}
                        </Typography>
                        {page.link && (
                          <>
                            <br />
                            <Link href={page.link} target="_blank" rel="noopener noreferrer" variant="body2">
                              Visit Page
                            </Link>
                          </>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      color="primary"
                      onClick={() => handleAddPage(page)}
                      disabled={loading}
                    >
                      <Add />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Success message */}
      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={6000} 
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccessMessage} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error message */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PageSearch;
