require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

//connect DB
const connectDB = require('./db/connect')

//middleware
const authenticateUser = require('./middleware/authentication');

//routers
const authRouter = require('./routes/auth')
const taskRouter = require('./routes/tasks')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
app.use(cookieParser());
app.use(cors()); 
// extra packages

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tasks', authenticateUser, taskRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
