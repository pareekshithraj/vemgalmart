import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server, Socket } from 'socket.io';

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
import paymentRoutes from './routes/paymentRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
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
app.set('io', io);

io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    // Customer or Delivery tracking a specific order
    socket.on('join_order_room', (orderId: string) => {
        socket.join(`order_${orderId}`);
        console.log(`Socket ${socket.id} joined room order_${orderId}`);
    });

    socket.on('leave_order_room', (orderId: string) => {
        socket.leave(`order_${orderId}`);
        console.log(`Socket ${socket.id} left room order_${orderId}`);
    });

    // Delivery Partner broadcasting location
    socket.on('delivery_location_update', (data: { orderId: string, lat: number, lng: number }) => {
        // Broadcast location only to users inside this specific order room
        io.to(`order_${data.orderId}`).emit('delivery_location_update', {
            lat: data.lat,
            lng: data.lng,
            timestamp: new Date().toISOString()
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Routes
app.use('/api/auth', authRoutes);


import couponRoutes from './routes/couponRoutes';
import reviewRoutes from './routes/reviewRoutes';
import searchRoutes from './routes/searchRoutes';
import wishlistRoutes from './routes/wishlistRoutes';

// ...

app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/payments', paymentRoutes);

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.send('Vemgal Mart API Running 🚀');
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
