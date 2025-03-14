import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Tooltip
} from '@mui/material';
import { 
  Search, 
  Refresh, 
  Event, 
  LocationOn, 
  CalendarMonth, 
  AccessTime,
  OpenInNew
} from '@mui/icons-material';
import { eventApi } from '../services/api';
import config from '../utils/config';
import { format, parseISO } from 'date-fns';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(config.DEFAULTS.PAGINATION.EVENTS_PER_PAGE);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedPageId, setSelectedPageId] = useState('');

  // Fetch events on component mount and when pagination changes
  useEffect(() => {
    fetchEvents();
  }, [page, rowsPerPage, selectedPageId]);

  // Fetch events with pagination
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await eventApi.getEvents({
        page: page + 1, // API uses 1-based indexing
        limit: rowsPerPage,
        page_id: selectedPageId || undefined,
        search: searchTerm || undefined
      });
      
      setEvents(result.data || []);
      setTotalCount(result.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchEvents();
  };



  // Format date and time
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    try {
      const dateObj = parseISO(dateTimeStr);
      return format(dateObj, 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateTimeStr;
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
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Facebook Events
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />} 
          onClick={fetchEvents}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Search and filter controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Search Events"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: '200px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Filter by Page ID"
            variant="outlined"
            size="small"
            value={selectedPageId}
            onChange={(e) => setSelectedPageId(e.target.value)}
            sx={{ width: '200px' }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            startIcon={<Search />}
            disabled={loading}
          >
            Search
          </Button>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : events.length > 0 ? (
        <Paper>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="events table">
              <TableHead>
                <TableRow>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Page</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id} hover>
                    <TableCell component="th" scope="row">
                      <Typography variant="body1" fontWeight="medium">
                        {event.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {event.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {event.page_name || 'Unknown Page'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {event.page_id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarMonth fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatDateTime(event.start_time)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {event.location ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="body2">
                            {event.location}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No location
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={event.is_canceled ? 'Canceled' : 'Active'} 
                        color={event.is_canceled ? 'error' : 'success'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View on Facebook">
                        <IconButton 
                          color="primary" 
                          size="small"
                          component={Link}
                          href={`https://facebook.com/events/${event.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <OpenInNew />
                        </IconButton>
                      </Tooltip>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No events found. Try changing your search criteria or fetch events from monitored pages.
          </Typography>
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

export default EventList;
