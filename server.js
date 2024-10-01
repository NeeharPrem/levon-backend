const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const { errorHandler } = require('./errorHandler');

dotenv.config();

const PORT = process.env.PORT || 3001;
const monguri = process.env.MONGO_URI;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

mongoose.connect(monguri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB', err));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/weather', weatherRoutes);

app.set('io', io);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

app.use(errorHandler);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});