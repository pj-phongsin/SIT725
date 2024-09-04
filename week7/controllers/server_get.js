const express = require("express");
const path = require('path');
const http = require('http'); // Add this line
const { Server } = require('socket.io'); // Add this line
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app); // Replace app.listen with server.listen
const io = new Server(server); // Add this line

const uri = "mongodb+srv://jphongsin:xa7jjaPBiQm3t1PC@cluster0.gsqsjgi.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let database;

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

// Serve index.html from 'views' directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    
    setInterval(()=>{
        socket.emit('number', parseInt(Math.random()*10));
        }, 1000);

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        console.log('chat message: ' + msg);
    });
});

const addTwoNumber = (n1, n2) => {
    return n1 + n2;
};

app.get('/addTwoNumbers/:firstNumber/:secondNumber', function(req, res, next) {
    const firstNumber = parseInt(req.params.firstNumber);
    const secondNumber = parseInt(req.params.secondNumber);
    const result = firstNumber + secondNumber || null;
    if (result == null) {
        res.json({ result: result, statusCode: 400 }).status(400);
    } else {
        res.json({ result: result, statusCode: 200 }).status(200);
    }
});

app.get("/Display", (req, res) => {
    const n1 = "<html><body><H1>HELLO THERE </H1></body></html>";
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from(n1));
});

app.get("/getMoviesByYear", async (req, res) => {
    const startYear = parseInt(req.query.startYear);
    const endYear = parseInt(req.query.endYear);

    if (isNaN(startYear) || isNaN(endYear) || startYear > endYear) {
        return res.status(400).json({ statusCode: 400, message: "Invalid year range" });
    }

    try {
        if (!database) {
            await client.connect();
            database = client.db('sample_mflix');
        }
        const movies = database.collection('movies');
        const query = { year: { $gte: startYear, $lte: endYear } };
        const movieList = await movies.find(query).limit(20).toArray();
        res.json({ statusCode: 200, data: movieList });
    } catch (error) {
        console.error(error);
        res.json({ statusCode: 500, message: "Internal Server Error" });
    }
});

app.get('/page2.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'page2.html'));
});

const port = 3040;
server.listen(port, () => { // Replace app.listen with server.listen
    console.log("Listening to port " + port);
});