import rateLimit from "express-rate-limit";

// Define the rate limit middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per window
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
  headers: true, // Send rate limit headers
});

export default apiLimiter;
