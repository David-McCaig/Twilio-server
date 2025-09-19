import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import twilio from 'twilio';

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Only initialize Twilio client if credentials are provided
let client = null;
if (accountSid && authToken && accountSid !== 'your_account_sid_here' && authToken !== 'your_auth_token_here') {
  client = twilio(accountSid, authToken);
  console.log('Twilio client initialized successfully');
} else {
  console.log('Twilio credentials not configured. SMS functionality will be disabled.');
}

const app = express();
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGIN_PORT = process.env.ALLOWED_ORIGIN_PORT || 3000;

// CORS configuration - allow requests from specified domains and ports
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow requests from us.merchantos.com
    if (origin === 'https://us.merchantos.com') {
      return callback(null, true);
    }
    
    // Check if the origin is from the allowed port (for local development)
    const originPort = new URL(origin).port;
    if (originPort === ALLOWED_ORIGIN_PORT.toString()) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Basic Express Server!' });
});

// Endpoint that returns an array with an object containing name and phone number
app.get('/api/contact', (req, res) => {
  const contactData = [
    {
      name: "John Doe",
      phoneNumber: "555-123-4567"
    }
  ];
  
  res.json(contactData);
});



// POST endpoint to receive contact data
app.post('/contact', async (req, res) => {
  const { message, phoneNumber } = req.body;
  
  // Console log the received data
  console.log('Received contact data:', { message, phoneNumber });
  
  try {
    if (!client) {
      // Twilio not configured - just log the data
      console.log('SMS not sent - Twilio not configured');
      res.status(201).json({
        message: 'Contact data received successfully (SMS not sent - Twilio not configured)',
        data: { message, phoneNumber }
      });
      return;
    }
    
    // Send SMS using Twilio
    const messageSend = await client.messages.create({
      body: message,
      from: "+19285979770",
      to: phoneNumber,
    });
    
    console.log('SMS sent successfully:', messageSend.sid);
    
    // Send a success response
    res.status(201).json({
      message: 'Contact data received and SMS sent successfully',
      data: { message, phoneNumber },
      twilioSid: messageSend.sid
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({
      message: 'Error sending SMS',
      error: error.message
    });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Contact endpoint available at http://localhost:${PORT}/api/contact`);
});
