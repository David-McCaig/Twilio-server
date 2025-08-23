# Basic Express Server

A simple Node.js server built with Express.js that provides an API endpoint returning contact information.

## Installation

1. Make sure you have Node.js installed on your system
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

Start the server with:
```bash
npm start
```

Or run directly with:
```bash
node server.js
```

The server will start on `http://localhost:3000`

## Available Endpoints

### GET `/`
- Returns a welcome message
- Response: `{ "message": "Welcome to the Basic Express Server!" }`

### GET `/api/contact`
- Returns an array with an object containing name and phone number
- Response: 
  ```json
  [
    {
      "name": "John Doe",
      "phoneNumber": "555-123-4567"
    }
  ]
  ```

## Testing the Endpoints

You can test the endpoints using curl:

```bash
# Test the welcome endpoint
curl http://localhost:3000/

# Test the contact endpoint
curl http://localhost:3000/api/contact
```

Or simply open your browser and navigate to:
- `http://localhost:3000/` for the welcome message
- `http://localhost:3000/api/contact` for the contact data
# Twilio-server
