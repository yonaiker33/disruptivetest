const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http'); 
const socketIo = require('socket.io');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const themeRoutes = require('./routes/themeRoutes');
const contentRoutes = require('./routes/contentRoutes');
const crypto = require('crypto');
require('dotenv').config();
const authMiddleware = require('./middlewares/authMiddleware');
const Content = require('./models/Content');

const app = express();

const secretKey = crypto.randomBytes(32).toString('hex');
process.env.JWT_SECRET = secretKey;

function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
}

app.use(logger);

// Configuración de MongoDB
mongoose.connect('mongodb://localhost:27017/content_manager', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
mongoose.connection.once('open', () => {
    console.log('Conexión exitosa a MongoDB');
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'))
app.use(cors());


// Rutas
app.use('/api/users', userRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);
app.use('/api/themes', authMiddleware, themeRoutes);
app.use('/api/contents', contentRoutes);

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
});

Content.watch().on('change', (change) => {
    io.emit('contentChange', change.fullDocument);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
