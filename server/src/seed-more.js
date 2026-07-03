import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Book from './models/Book.js';
import Category from './models/Category.js';

dotenv.config({ path: './.env' });

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
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
  } else {
    console.error(`Source image missing: ${sourcePath}`);
  }
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

    const f1 = '/booksimages/silentEchoes.jpeg';
    const f2 = '/booksimages/moderUX.jpg';
    const f3 = '/booksimages/quantumimage.jpg';
    const f4 = '/booksimages/silentEchoes.jpeg';
    const f5 = '/booksimages/moderUX.jpg';

    const t1 = '/booksimages/quantumimage.jpg';
    const t2 = '/booksimages/silentEchoes.jpeg';
    const t3 = '/booksimages/moderUX.jpg';
    const t4 = '/booksimages/quantumimage.jpg';
    const t5 = '/booksimages/silentEchoes.jpeg';

    const s1 = '/booksimages/moderUX.jpg';
    const s2 = '/booksimages/quantumimage.jpg';
    const s3 = '/booksimages/silentEchoes.jpeg';
    const s4 = '/booksimages/moderUX.jpg';
    const s5 = '/booksimages/quantumimage.jpg';

    const books = [
      // Fantasy
      { title: 'The Starlight Archives', author: 'Brandon Sanderson', description: 'An epic fantasy set in a magical universe.', price: 599, category: createdCategories[0]._id, stock: 40, coverImage: f1, ratings: { average: 4.8, count: 120 } },
      { title: 'Echoes of Eternity', author: 'Patrick Rothfuss', description: 'A mystical journey through time and space.', price: 499, category: createdCategories[0]._id, stock: 35, coverImage: f2, ratings: { average: 4.7, count: 95 } },
      { title: 'The Clockwork King', author: 'Philip Pullman', description: 'Steampunk adventure in Victorian London.', price: 650, category: createdCategories[0]._id, stock: 20, coverImage: f3, ratings: { average: 4.6, count: 80 } },
      { title: 'Whispers in the Void', author: 'Isaac Asimov', description: 'Sci-fi thriller at the edge of the galaxy.', price: 550, category: createdCategories[0]._id, stock: 45, coverImage: f4, ratings: { average: 4.9, count: 210 } },
      { title: 'City of Neon Dreams', author: 'William Gibson', description: 'Cyberpunk dystopia full of mystery.', price: 420, category: createdCategories[0]._id, stock: 60, coverImage: f5, ratings: { average: 4.4, count: 150 } },
      
      // Tech
      { title: 'Code Complete', author: 'Steve McConnell', description: 'A practical handbook of software construction.', price: 1200, category: createdCategories[1]._id, stock: 15, coverImage: t1, ratings: { average: 4.9, count: 340 } },
      { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', description: 'Your journey to mastery in software development.', price: 1100, category: createdCategories[1]._id, stock: 25, coverImage: t2, ratings: { average: 4.8, count: 280 } },
      { title: 'Clean Architecture', author: 'Robert C. Martin', description: 'A craftsman\'s guide to software structure and design.', price: 950, category: createdCategories[1]._id, stock: 30, coverImage: t3, ratings: { average: 4.7, count: 190 } },
      { title: 'Refactoring UI', author: 'Adam Wathan', description: 'Learn how to design beautiful user interfaces.', price: 850, category: createdCategories[1]._id, stock: 40, coverImage: t4, ratings: { average: 4.9, count: 110 } },
      { title: 'System Design Interview', author: 'Alex Xu', description: 'An insider\'s guide to acing the system design interview.', price: 780, category: createdCategories[1]._id, stock: 50, coverImage: t5, ratings: { average: 4.8, count: 420 } },
      
      // Self-Help
      { title: 'Atomic Habits', author: 'James Clear', description: 'An easy & proven way to build good habits & break bad ones.', price: 600, category: createdCategories[2]._id, stock: 100, coverImage: s1, ratings: { average: 4.9, count: 850 } },
      { title: 'Deep Work', author: 'Cal Newport', description: 'Rules for focused success in a distracted world.', price: 450, category: createdCategories[2]._id, stock: 65, coverImage: s2, ratings: { average: 4.7, count: 320 } },
      { title: 'The Daily Stoic', author: 'Ryan Holiday', description: '366 meditations on wisdom, perseverance, and the art of living.', price: 550, category: createdCategories[2]._id, stock: 80, coverImage: s3, ratings: { average: 4.8, count: 410 } },
      { title: 'Mindset', author: 'Carol S. Dweck', description: 'The new psychology of success.', price: 400, category: createdCategories[2]._id, stock: 55, coverImage: s4, ratings: { average: 4.6, count: 290 } },
      { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', description: 'A groundbreaking tour of the mind and explains the two systems that drive the way we think.', price: 700, category: createdCategories[2]._id, stock: 45, coverImage: s5, ratings: { average: 4.7, count: 530 } }
    ];

    // Delete existing books with these titles to avoid duplicates
    await Book.deleteMany({ title: { $in: books.map(b => b.title) } });

    await Book.insertMany(books);

    console.log('15 More Dummy Books Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
