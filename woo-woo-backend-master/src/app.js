import 'dotenv/config.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import { createHealerBulk, seedDataForExistUser } from './modules/general/models/seeder/seed-data';

// import router
//import indexRouter from './routes/router';
import indexRouter from './router';
import handleErrors from './modules/general/middlewares/error-handle-middleware/error-handle-middleware';

const app = express();

/**
 * Middle-wares
 */

app.use(express.json()); // app.use(express.json({ limit: '10kb' })); // Body limit is 10
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static('public'));
app.use(cookieParser());
app.use(compression());
app.use(logger('dev'));
// take a look at https://www.npmjs.com/package/cors#configuring-cors-w-dynamic-origin
const whitelist = [
  'https://woo-woo.net',
  'https://www.woo-woo.net',
  process.env.APP_DOMAIN,
  // this is stripe webhook
  '3.18.12.63',
  '3.130.192.231',
  '13.235.14.237',
  '3.235.122.149',
  '18.211.135.69',
  '35.154.171.200',
  '52.15.183.38',
  '54.88.130.119',
  '54.88.130.237',
  '54.187.174.169',
  '54.187.205.235',
  '54.187.216.72',
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // callback(new Error('Not allowed by CORS'));
      callback(null, true); // need to comment it for production
    }
  },
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(xss());
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//   })
// ); // will use in production
/**
 * Routers
 */
app.use('/', indexRouter);

// Error handling
app.use(handleErrors);

// this is to seed some sample data

=======
// createHealerBulk();
//seedDataForExistUser();

export default app;
