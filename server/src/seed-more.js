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

    const brainPath = 'C:\\Users\\mjman\\.gemini\\antigravity-ide\\brain\\2276c3a5-ad8b-4b57-bf8a-9b583382a699';
    
    // Copy Images
    const f1 = copyImage(path.join(brainPath, 'book_fantasy_1_1782378891323.png'), 'book_fantasy_1.png');
    const f2 = copyImage(path.join(brainPath, 'book_fantasy_2_1782378903332.png'), 'book_fantasy_2.png');
    const f3 = copyImage(path.join(brainPath, 'book_fantasy_3_1782378916326.png'), 'book_fantasy_3.png');
    const f4 = copyImage(path.join(brainPath, 'book_fantasy_4_1782378927346.png'), 'book_fantasy_4.png');
    const f5 = copyImage(path.join(brainPath, 'book_fantasy_5_1782378940062.png'), 'book_fantasy_5.png');

    const t1 = copyImage(path.join(brainPath, 'book_tech_1_1782379024658.png'), 'book_tech_1.png');
    const t2 = copyImage(path.join(brainPath, 'book_tech_2_1782378968112.png'), 'book_tech_2.png');
    const t3 = copyImage(path.join(brainPath, 'book_tech_3_1782379037955.png'), 'book_tech_3.png');
    const t4 = copyImage(path.join(brainPath, 'book_tech_4_1782378990159.png'), 'book_tech_4.png');
    const t5 = copyImage(path.join(brainPath, 'book_tech_5_1782379002159.png'), 'book_tech_5.png');

    const s1 = copyImage(path.join(brainPath, 'book_selfhelp_1_1782379049156.png'), 'book_selfhelp_1.png');
    // Reuse self-help images since we hit quota limit
    const s2 = copyImage(path.join(brainPath, 'book_selfhelp_cover_1782378438315.png'), 'book_selfhelp_2.png');
    const s3 = copyImage(path.join(brainPath, 'book_selfhelp_cover_1782378438315.png'), 'book_selfhelp_3.png');
    const s4 = copyImage(path.join(brainPath, 'book_selfhelp_1_1782379049156.png'), 'book_selfhelp_4.png');
    const s5 = copyImage(path.join(brainPath, 'book_selfhelp_cover_1782378438315.png'), 'book_selfhelp_5.png');

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
