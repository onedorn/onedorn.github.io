const express = require('express');
const connectDB = require('./src/db/mongoose');
const path = require('path');

connectDB();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/users', require('./src/routers/users'));
app.use('/tasks', require('./src/routers/tasks'));

app.use(express.static('client-static-files'));
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client-static-files', 'index.html')));

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));