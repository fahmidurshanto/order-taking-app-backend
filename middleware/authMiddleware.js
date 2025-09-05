const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with service account credentials
let firebaseInitialized = false;
try {
  if (!admin.apps.length) {
    // Check if we have service account credentials
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      // If we have a service account key, use it
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      firebaseInitialized = true;
      console.log('Firebase Admin SDK initialized with service account');
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // If we have a path to service account file, use it
      admin.initializeApp({
        credential: admin.credential.applicationDefault()
      });
      firebaseInitialized = true;
      console.log('Firebase Admin SDK initialized with default credentials');
    } else {
      // Fallback: Initialize without credentials (will only work for testing)
      admin.initializeApp();
      firebaseInitialized = true;
      console.log('Firebase Admin SDK initialized without credentials (testing mode)');
    }
  } else {
    firebaseInitialized = true;
  }
} catch (error) {
  console.error('Firebase Admin SDK initialization error:', error.message);
  firebaseInitialized = false;
}

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // First, try to verify as JWT token
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
        return;
      } catch (jwtError) {
        // If JWT verification fails, try Firebase ID token verification
        try {
          // Check if Firebase Admin is properly initialized
          if (!firebaseInitialized || !admin.apps.length) {
            console.warn('Firebase Admin SDK not properly initialized, falling back to simple token check');
            // Simple token validation for testing purposes
            if (token && token.length > 50) { // Firebase tokens are typically long
              req.user = {
                id: 'test-user',
                email: 'test@example.com'
              };
              next();
              return;
            } else {
              throw new Error('Invalid token format');
            }
          }
          
          const decodedToken = await admin.auth().verifyIdToken(token);
          
          // Create a user object that mimics the JWT user structure
          req.user = {
            id: decodedToken.uid,
            email: decodedToken.email,
            // Add other fields as needed
          };
          
          next();
          return;
        } catch (firebaseError) {
          console.error('Both JWT and Firebase token verification failed:', jwtError.message, firebaseError.message);
          res.status(401).json({ message: 'টোকেন অবৈধ, অনুমোদন করা হয়নি' });
          return;
        }
      }
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ message: 'টোকেন অবৈধ, অনুমোদন করা হয়নি' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'অনুমোদন করা হয়নি, টোকেন নেই' });
  }
});

const adminCheck = (req, res, next) => {
  // For now, we'll allow all authenticated users to access admin routes
  // In a production environment, you would implement proper role checking
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: 'অনুমোদন করা হয়নি, শুধুমাত্র অ্যাডমিনের জন্য' });
  }
};

module.exports = { protect, admin: adminCheck };