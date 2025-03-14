import React, { useState } from 'react';
import { 
  CssBaseline, 
  Container, 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Tabs, 
  Tab, 
  ThemeProvider, 
  createTheme 
} from '@mui/material';
import { Search, List, Event } from '@mui/icons-material';
import PageSearch from './components/PageSearch';
import PageList from './components/PageList';
import EventList from './components/EventList';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1877F2', // Facebook blue
    },
    secondary: {
      main: '#42B72A', // Facebook green
    },
  },
});

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              FB Analyzer - Event Fetcher
            </Typography>
          </Toolbar>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="navigation tabs"
            centered
            indicatorColor="secondary"
            textColor="inherit"
          >
            <Tab icon={<Search />} label="Search Pages" />
            <Tab icon={<List />} label="Monitored Pages" />
            <Tab icon={<Event />} label="Events" />
          </Tabs>
        </AppBar>
        
        <Container maxWidth="lg">
          <TabPanel value={tabValue} index={0}>
            <PageSearch />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <PageList />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <EventList />
          </TabPanel>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
