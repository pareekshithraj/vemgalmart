import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import adminRoutes from './routes/adminRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import uploadRoutes from './routes/uploadRoutes';
import categoryRoutes from './routes/categoryRoutes';
import bannerRoutes from './routes/bannerRoutes';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || ["http://localhost:5173", "https://vemgalmart-pareekshithraj.vercel.app", "https://vemgalmart.vercel.app"],
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 5000;

// Update standard CORS as well
app.use(cors({
    origin: process.env.CLIENT_URL || ["http://localhost:5173", "https://vemgalmart-pareekshithraj.vercel.app", "https://vemgalmart.vercel.app"],
    credentials: true
}));
app.use(express.json());

// Share io instance
// @ts-ignore
app.set('io', io);

io.on('connection', (socket: any) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Routes
app.use('/api/auth', authRoutes);


// ...

app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.send('Vemgal Mart API Running 🚀');
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
