import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Delete, Refresh, Event } from '@mui/icons-material';
import { facebookPageApi } from '../services/api';

const PageList = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);
  const [fetchingEvents, setFetchingEvents] = useState(false);
  const [fetchingEventsForPage, setFetchingEventsForPage] = useState(null);

  // Fetch pages on component mount
  useEffect(() => {
    fetchPages();
  }, []);

  // Fetch all monitored pages
  const fetchPages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await facebookPageApi.getPages();
      setPages(result || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching pages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle page deletion
  const handleDeletePage = async () => {
    if (!pageToDelete) return;
    
    setLoading(true);
    try {
      await facebookPageApi.deletePage(pageToDelete.page_id);
      setPages(pages.filter(page => page.page_id !== pageToDelete.page_id));
      setSuccessMessage(`Page "${pageToDelete.name}" removed successfully!`);
      setDeleteDialogOpen(false);
      setPageToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error removing page. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (page) => {
    setPageToDelete(page);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPageToDelete(null);
  };

  // Fetch events for a specific page
  const handleFetchEvents = async (page) => {
    setFetchingEvents(true);
    setFetchingEventsForPage(page.page_id);
    try {
      await facebookPageApi.fetchPageEvents(page.page_id);
      setSuccessMessage(`Events for "${page.name}" fetched successfully!`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching events. Please try again.');
    } finally {
      setFetchingEvents(false);
      setFetchingEventsForPage(null);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Monitored Facebook Pages
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />} 
          onClick={fetchPages}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {loading && !fetchingEvents ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : pages.length > 0 ? (
        <Paper sx={{ p: 2 }}>
          <List>
            {pages.map((page, index) => (
              <React.Fragment key={page.page_id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={page.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Category: {page.category || 'N/A'}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          ID: {page.page_id}
                        </Typography>
                        {page.url && (
                          <>
                            <br />
                            <Typography component="span" variant="body2">
                              <a href={page.url} target="_blank" rel="noopener noreferrer">
                                Visit Page
                              </a>
                            </Typography>
                          </>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => handleFetchEvents(page)}
                      disabled={fetchingEvents}
                      sx={{ mr: 1 }}
                    >
                      {fetchingEvents && fetchingEventsForPage === page.page_id ? (
                        <CircularProgress size={24} />
                      ) : (
                        <Event />
                      )}
                    </IconButton>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => openDeleteDialog(page)}
                      disabled={loading}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No Facebook pages are being monitored. Add a page using the search feature.
          </Typography>
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>Remove Facebook Page</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to stop monitoring "{pageToDelete?.name}"? This will remove the page and all associated events from the system.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeletePage} color="error" autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>

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

export default PageList;
