import mongoose from 'mongoose';
import Book from './src/models/Book.js';
import Category from './src/models/Category.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const books = await Book.find().populate('category', 'name').lean();
  console.log(JSON.stringify(books, null, 2));
  process.exit(0);
});
