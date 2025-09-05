# Borkha Order Taking App - Backend

Node.js backend for the Borkha Order Taking App, built with Express.js and MongoDB.

## Features

- RESTful API for order management
- User authentication with Firebase
- MongoDB database integration
- Image upload with Cloudinary
- CORS enabled for frontend communication

## Deployment to Vercel

### Prerequisites

1. Create a MongoDB database (MongoDB Atlas recommended)
2. Set up a Cloudinary account for image storage
3. Create a Firebase project for authentication

### Environment Variables

Create a `.env` file with the following variables:

```
NODE_ENV=production
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FIREBASE_SERVICE_ACCOUNT_KEY=your_firebase_service_account_key
```

### Vercel Configuration

The `vercel.json` file configures the Node.js server:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

### Deployment Steps

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set the build command to: `npm install`
4. Set the output directory to: `/`
5. Add all environment variables from your `.env` file
6. Deploy the project

## Development

### Installation

```bash
npm install
```

### Running the Server

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

### Database Scripts

```bash
# Import sample data
npm run data:import

# Destroy all data
npm run data:destroy

# Check database indexes
npm run indexes:check

# Fix database indexes
npm run indexes:fix

# Check data integrity
npm run data:check

# Cleanup data
npm run data:cleanup
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get a specific order
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update an order
- `DELETE /api/orders/:id` - Delete an order
- `GET /api/orders/stats` - Get order statistics
- `PATCH /api/orders/:id/status` - Update order status

## Learn More

To learn more about the technologies used:

- [Express.js](https://expressjs.com/)
- [MongoDB](https://mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Vercel](https://vercel.com/)