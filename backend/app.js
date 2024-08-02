const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const userRouter = require('./Routers/UserRouter');
const adminRouter = require('./Routers/AdminRouter');

dotenv.config();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', userRouter);
app.use('/', adminRouter);

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_ATLAS, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
