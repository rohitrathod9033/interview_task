"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.URI;
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log('Successfully connected to MongoDB');
    }
    catch (err) {
        console.error('MongoDB connection error:', err);
    }
};
connectDB();
exports.default = mongoose_1.default.connection;
