const express = require('express')
const app = express()
const port = 3000

let usersRoutes = require('./routes/users');

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/api',usersRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});