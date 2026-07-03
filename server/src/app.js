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

// TEMPORARY: One-time seed endpoint — remove after use
app.get('/api/seed-now', async (req, res) => {
  try {
    const Book = (await import('./models/Book.js')).default;
    const Category = (await import('./models/Category.js')).default;

    const categoriesData = [
      { name: 'Fantasy & Sci-Fi', description: 'Explore magical worlds and futuristic concepts.' },
      { name: 'Technology & Design', description: 'Books for developers, designers, and tech enthusiasts.' },
      { name: 'Self-Help & Philosophy', description: 'Improve your life and clear your mind.' }
    ];

    const createdCategories = [];
    for (const cat of categoriesData) {
      let category = await Category.findOne({ name: cat.name });
      if (!category) category = await Category.create(cat);
      createdCategories.push(category);
    }

    const placeholder = 'https://placehold.co/400x600/1a1a2e/ffffff?text=AuraBooks';
    const books = [
      { title: 'The Starlight Archives', author: 'Brandon Sanderson', description: 'An epic fantasy set in a magical universe.', price: 599, category: createdCategories[0]._id, stock: 40, coverImage: placeholder, ratings: { average: 4.8, count: 120 } },
      { title: 'Echoes of Eternity', author: 'Patrick Rothfuss', description: 'A mystical journey through time and space.', price: 499, category: createdCategories[0]._id, stock: 35, coverImage: placeholder, ratings: { average: 4.7, count: 95 } },
      { title: 'The Clockwork King', author: 'Philip Pullman', description: 'Steampunk adventure in Victorian London.', price: 650, category: createdCategories[0]._id, stock: 20, coverImage: placeholder, ratings: { average: 4.6, count: 80 } },
      { title: 'Whispers in the Void', author: 'Isaac Asimov', description: 'Sci-fi thriller at the edge of the galaxy.', price: 550, category: createdCategories[0]._id, stock: 45, coverImage: placeholder, ratings: { average: 4.9, count: 210 } },
      { title: 'City of Neon Dreams', author: 'William Gibson', description: 'Cyberpunk dystopia full of mystery.', price: 420, category: createdCategories[0]._id, stock: 60, coverImage: placeholder, ratings: { average: 4.4, count: 150 } },
      { title: 'Code Complete', author: 'Steve McConnell', description: 'A practical handbook of software construction.', price: 1200, category: createdCategories[1]._id, stock: 15, coverImage: placeholder, ratings: { average: 4.9, count: 340 } },
      { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', description: 'Your journey to mastery in software development.', price: 1100, category: createdCategories[1]._id, stock: 25, coverImage: placeholder, ratings: { average: 4.8, count: 280 } },
      { title: 'Clean Architecture', author: 'Robert C. Martin', description: "A craftsman's guide to software structure and design.", price: 950, category: createdCategories[1]._id, stock: 30, coverImage: placeholder, ratings: { average: 4.7, count: 190 } },
      { title: 'Refactoring UI', author: 'Adam Wathan', description: 'Learn how to design beautiful user interfaces.', price: 850, category: createdCategories[1]._id, stock: 40, coverImage: placeholder, ratings: { average: 4.9, count: 110 } },
      { title: 'System Design Interview', author: 'Alex Xu', description: "An insider's guide to acing the system design interview.", price: 780, category: createdCategories[1]._id, stock: 50, coverImage: placeholder, ratings: { average: 4.8, count: 420 } },
      { title: 'Atomic Habits', author: 'James Clear', description: 'An easy & proven way to build good habits & break bad ones.', price: 600, category: createdCategories[2]._id, stock: 100, coverImage: placeholder, ratings: { average: 4.9, count: 850 } },
      { title: 'Deep Work', author: 'Cal Newport', description: 'Rules for focused success in a distracted world.', price: 450, category: createdCategories[2]._id, stock: 65, coverImage: placeholder, ratings: { average: 4.7, count: 320 } },
      { title: 'The Daily Stoic', author: 'Ryan Holiday', description: '366 meditations on wisdom, perseverance, and the art of living.', price: 550, category: createdCategories[2]._id, stock: 80, coverImage: placeholder, ratings: { average: 4.8, count: 410 } },
      { title: 'Mindset', author: 'Carol S. Dweck', description: 'The new psychology of success.', price: 400, category: createdCategories[2]._id, stock: 55, coverImage: placeholder, ratings: { average: 4.6, count: 290 } },
      { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', description: 'A groundbreaking tour of the mind and explains the two systems that drive the way we think.', price: 700, category: createdCategories[2]._id, stock: 45, coverImage: placeholder, ratings: { average: 4.7, count: 530 } }
    ];

    await Book.deleteMany({ title: { $in: books.map(b => b.title) } });
    await Book.insertMany(books);

    res.json({ status: 'success', message: `${books.length} books seeded successfully!` });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

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
