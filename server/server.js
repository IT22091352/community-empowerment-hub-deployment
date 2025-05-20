try {
  require('dotenv').config();
} catch (err) {
  console.log("dotenv not available, using environment variables from Heroku");
}
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dbConnect = require('./utils/dbConnect');


const path = require("path");

// Routes imports
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");
const shopPortfolioRouter = require("./routes/shop/portfolio-routes");

// Import job portal routes
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const userRouter = require('./routes/userRoutes');

// Import configuration check routes
const configRoutes = require('./routes/common/config-routes');
const healthRoutes = require('./routes/common/health-routes');

console.log("Connecting to MongoDB...");

// Connect to MongoDB
dbConnect()
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    // Log more details about the error for debugging
    if (error.name === 'MongoServerSelectionError') {
      console.error("MongoDB connection timeout. Check network or credentials.");
    }
  });

// Log environment details for debugging
console.log("Node Environment:", process.env.NODE_ENV);
console.log("Port:", process.env.PORT);
console.log("MongoDB URI exists:", !!process.env.MONGO_URI);

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });
}


const PORT = process.env.PORT || 5000;

// Standard CORS configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? ["https://community-empowerment-hub-313ac18da07a.herokuapp.com", "https://community-empowerment-hub.herokuapp.com"] 
      : "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Body parser error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON', err);
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next(err);
});

// Route middlewares
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/shop/portfolio", shopPortfolioRouter);

// Apply job portal routes
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/user', userRouter);

app.use("/api/reviews", require("./routes/shop/review-routes"));

// Configuration check route
app.use("/api/system", configRoutes);

// Health check routes
app.use("/api/health", healthRoutes);

// 404 Not Found middleware
app.use((req, res, next) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
});

// Global error handling middleware (should be last)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack || err);
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'An unexpected error occurred' 
    : (err.message || 'Internal Server Error');
  
  res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

// Start the server
app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));