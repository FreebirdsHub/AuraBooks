import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.js';
import AppError from './utils/AppError.js';
import { config } from './config/index.js';
import authRouter from './routes/authRoutes.js';
import bookRouter from './routes/bookRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import wishlistRouter from './routes/wishlistRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import { webhookHandler } from './controllers/paymentController.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));

// Webhook route requires raw body for signature verification
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhookHandler);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve book cover images from the repo root booksimages/ folder
app.use('/booksimages', express.static(path.join(__dirname, '../../booksimages')));

// Development logging
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Swagger Documentation
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/books', bookRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// Handle unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
