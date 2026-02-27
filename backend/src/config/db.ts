import mongoose from 'mongoose';
const MONGO_URI = process.env.URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI!);
        console.log('Successfully connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

connectDB();

export default mongoose.connection;