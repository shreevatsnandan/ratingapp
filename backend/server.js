const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const authRoutes = require('./routes/auth')
const addUserRoutes = require('./routes/addUser');
const getUserRoutes = require('./routes/users');
const storeownerRoutes = require('./routes/storeowner');

app.use(cors());
app.use(bodyParser.json());
app.use('/api', authRoutes);
app.use('/getuser', getUserRoutes);
app.use('/add', addUserRoutes);
app.use('/storeowner', storeownerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
