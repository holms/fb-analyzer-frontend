# FB Analyzer Frontend

A React.js frontend with Material UI for the FB Analyzer project. This service provides a user interface for managing Facebook pages and events.

## Features

- Search for Facebook pages using the Facebook Graph API
- Add, view, and delete monitored Facebook pages
- Trigger event fetching for specific pages
- Modern, responsive UI built with Material UI

## Technology Stack

- React.js 18
- Material UI 5
- Axios for API requests
- Environment variables for configuration

## Environment Variables

This service uses environment variables for configuration instead of local environment files. Copy the `.env.example` file to `.env` and update the values:

```
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8000

# Facebook Graph API Configuration
REACT_APP_FACEBOOK_API_VERSION=v18.0
REACT_APP_FACEBOOK_APP_ID=your_app_id_here
```

## Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the development server:
   ```
   npm start
   ```

### Building for Production

```
npm run build
```

## Docker

The service includes a Dockerfile for containerization. Build the Docker image:

```
docker build -t fb-analyzer-frontend .
```

Run the container:

```
docker run -p 80:80 fb-analyzer-frontend
```

## Integration with FB Analyzer

This frontend service integrates with the FB Analyzer backend services, particularly the event-fetcher service for managing Facebook pages and events.
