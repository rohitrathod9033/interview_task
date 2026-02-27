import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import modular routes
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
import './config/db';

app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/", (req, res) => {
  res.status(200).json("API Runing..")
})

// Modular Routes mount points
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
