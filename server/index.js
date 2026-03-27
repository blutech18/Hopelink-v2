import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const DEFAULT_PORT = Number(process.env.PORT) || 5001;
const MAX_PORT_RETRIES = 10;

// Security and performance middleware
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://hopelink-seven.vercel.app",
            "https://www.hopelink-seven.vercel.app",
          ]
        : ["http://localhost:3000"],
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes placeholder
app.get("/api/test", (req, res) => {
  res.json({ message: "HopeLink API is running!" });
});

// Future API routes will be added here:
// app.use('/api/auth', authRoutes)
// app.use('/api/donations', donationRoutes)
// app.use('/api/requests', requestRoutes)
// app.use('/api/deliveries', deliveryRoutes)
// app.use('/api/events', eventRoutes)
// app.use('/api/users', userRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// Start server and fall back to the next port if the preferred one is taken.
const startServer = (port, attempt = 0) => {
  const server = app.listen(port, () => {
    console.log(`🚀 HopeLink server running on port ${port}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 Health check: http://localhost:${port}/api/health`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && attempt < MAX_PORT_RETRIES) {
      const nextPort = port + 1;
      console.warn(
        `⚠️ Port ${port} is in use. Retrying on port ${nextPort}...`,
      );
      startServer(nextPort, attempt + 1);
      return;
    }

    console.error("❌ Failed to start server:", error);
    process.exit(1);
  });
};

startServer(DEFAULT_PORT);
