import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Book from './models/Book.js';
import Category from './models/Category.js';

dotenv.config({ path: '../.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore');
    console.log('MongoDB Connected for Seeding');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const copyImage = (sourcePath, filename) => {
  const uploadsDir = path.join(__dirname, '../../server/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  const destPath = path.join(uploadsDir, filename);
  fs.copyFileSync(sourcePath, destPath);
  console.log(`Copied image to ${destPath}`);
  return `http://localhost:5000/uploads/${filename}`;
};

const importData = async () => {
  await connectDB();

  try {
    // 1. Ensure categories exist
    const categoriesData = [
      { name: 'Fantasy & Sci-Fi', description: 'Explore magical worlds and futuristic concepts.' },
      { name: 'Technology & Design', description: 'Books for developers, designers, and tech enthusiasts.' },
      { name: 'Self-Help & Philosophy', description: 'Improve your life and clear your mind.' }
    ];

    const createdCategories = [];
    for (const cat of categoriesData) {
      let category = await Category.findOne({ name: cat.name });
      if (!category) {
        category = await Category.create(cat);
      }
      createdCategories.push(category);
    }

    // 2. Process images and create books
    // Paths to the generated images in the artifacts directory
    const imagePaths = [
      'C:\\Users\\mjman\\.gemini\\antigravity-ide\\brain\\2276c3a5-ad8b-4b57-bf8a-9b583382a699\\book_fantasy_cover_1782378396868.png',
      'C:\\Users\\mjman\\.gemini\\antigravity-ide\\brain\\2276c3a5-ad8b-4b57-bf8a-9b583382a699\\book_tech_cover_1782378426680.png',
      'C:\\Users\\mjman\\.gemini\\antigravity-ide\\brain\\2276c3a5-ad8b-4b57-bf8a-9b583382a699\\book_selfhelp_cover_1782378438315.png'
    ];

    const img1Url = copyImage(imagePaths[0], 'book_fantasy_cover.png');
    const img2Url = copyImage(imagePaths[1], 'book_tech_cover.png');
    const img3Url = copyImage(imagePaths[2], 'book_selfhelp_cover.png');

    const books = [
      {
        title: 'The Midnight Library',
        author: 'Matt Haig',
        description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?',
        price: 450,
        category: createdCategories[0]._id,
        stock: 50,
        coverImage: img1Url,
        ratings: { average: 4.8, count: 124 }
      },
      {
        title: 'Designing Interfaces',
        author: 'Jenifer Tidwell',
        description: 'Designing good application interfaces isn\'t easy now that companies need to create compelling, cohesive user experiences across multiple platforms and devices. This guide provides best practices and reusable ideas to help you solve common UI problems and design amazing digital products.',
        price: 899,
        category: createdCategories[1]._id,
        stock: 30,
        coverImage: img2Url,
        ratings: { average: 4.6, count: 85 }
      },
      {
        title: 'The Art of Clear Thinking',
        author: 'Rolf Dobelli',
        description: 'Have you ever invested time in something that, with hindsight, just wasn\'t worth it? Or continued doing something you knew was bad for you? These are examples of cognitive biases, simple errors we all make in our day-to-day thinking. This book shows you how to recognize and avoid these errors.',
        price: 399,
        category: createdCategories[2]._id,
        stock: 100,
        coverImage: img3Url,
        ratings: { average: 4.9, count: 312 }
      }
    ];

    // Delete existing books with these titles to avoid duplicates if run multiple times
    await Book.deleteMany({ title: { $in: books.map(b => b.title) } });

    await Book.insertMany(books);

    console.log('Dummy Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
