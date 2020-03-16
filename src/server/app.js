const express = require('express');
const path= require('path');
const app = express();

app.get('/', (req, res) => {
   res.send('Hello from Express!');
});
const publicPath = path.resolve(__dirname, '..', '..', 'public');
app.use(express.static(publicPath));

app.listen(3000, () => {
   console.log('MERN Boilerplate listening on port 3000!');
});