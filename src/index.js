// server.mjs
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Reemplaza '*' con la URL de tu frontend en producción por seguridad
        methods: ['GET', 'POST']
    }
});

// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(cors());

// Endpoint para recibir datos desde Lambda
app.post('/update', (req, res) => {
    const newData = req.body.newData;
    console.log(newData)
    io.emit('update', newData);
    res.status(200).send('Data received');
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
