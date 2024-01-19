require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

//extra security packages
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

//connect DB
const connectDB = require('./db/connect')

//middleware
const authenticateUser = require('./middleware/authentication');

//routers
const authRouter = require('./routes/auth')
const taskRouter = require('./routes/tasks')
const listRouter = require('./routes/lists')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// extra middleware and security packages
app.set('trust proxy, 1');
app.use(rateLimiter({
  windowMs: 15*60*1000,
  max: 100
})); 
app.use(cookieParser());
app.use(cors()); 
app.use(xss()); 
app.use(helmet()); 

//middleware
app.use(express.json());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tasks', authenticateUser, taskRouter);
app.use('/api/v1/lists', authenticateUser, listRouter);

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
