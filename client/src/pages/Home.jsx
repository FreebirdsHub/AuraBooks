import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { BookOpen, Star, ArrowRight, Sparkles, ChevronLeft, ChevronRight, Award, Flame, Library } from 'lucide-react';
import api from '../services/api';
import ImageWithFallback from '../components/ImageWithFallback';
import { BookCardSkeleton } from '../components/Skeletons';
import { BOOKS } from '../constants/routes';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ books: 0, users: 0, orders: 0 });

  const carouselRef = useRef(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        // Fetch categories
        const catsRes = await api.get('/categories');
        setCategories(catsRes.data.data.categories.slice(0, 4));

        // Fetch high-rated books (Featured)
        const featRes = await api.get('/books', { params: { sort: '-ratings.average', limit: 8 } });
        setFeatured(featRes.data.data.books);

        // Fetch best sellers
        const bestRes = await api.get('/books', { params: { sort: '-createdAt', limit: 8 } });
        setBestSellers(bestRes.data.data.books);

        // Fetch stats if available, otherwise aggregate
        const statsRes = await api.get('/admin/stats').catch(() => null);
        if (statsRes) {
          setStats({
            books: statsRes.data.data.totalBooks,
            users: statsRes.data.data.totalUsers,
            orders: statsRes.data.data.totalOrders
          });
        } else {
          // Default fallbacks
          setStats({ books: featRes.data.results || 12, users: 48, orders: 25 });
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Animations configuration
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-darkBg text-slate-100 pb-20 space-y-24">
      {/* Floating Blurred Gradient Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Violet Blob */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square rounded-full bg-brand-500/10 blur-[120px] animate-blob-float-1" />
        {/* Emerald/Indigo Blob */}
        <div className="absolute top-[40%] right-[-10%] w-[45%] aspect-square rounded-full bg-emerald-500/5 blur-[120px] animate-blob-float-2" />
        {/* Bottom Blob */}
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] aspect-square rounded-full bg-purple-500/5 blur-[120px] animate-blob-float-1" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pt-16 md:pt-24 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Animated Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-300 border border-white/10 uppercase tracking-widest select-none">
            <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" /> Introducing AuraBooks Premium
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display leading-[1.05]"
          >
            Stories that elevate <br />
            <span className="bg-gradient-to-r from-brand-400 via-brand-200 to-emerald-400 bg-clip-text text-transparent">
              the human experience.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Explore a meticulously curated library of premium literature, technical guides, and timeless classics served with stunning visual elegance.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to={BOOKS}
              className="py-3.5 px-8 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold transition-all shadow-[0_4px_20px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_30px_rgba(139,92,246,0.4)] inline-flex items-center gap-2 border border-brand-500/25"
            >
              Explore Catalog <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#featured"
              className="py-3.5 px-8 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold transition-all backdrop-blur-md"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Netflix-style Featured Books Carousel */}
      <section id="featured" className="relative z-10 max-w-7xl mx-auto px-4 scroll-mt-24">
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white flex items-center gap-2.5">
              <Award className="w-6 h-6 text-brand-400" /> Featured Masterpieces
            </h2>
            <p className="text-slate-500 mt-1 text-xs sm:text-sm">Communities top rated and review verified narratives</p>
          </div>

          {/* Arrows */}
          <div className="flex gap-2">
            <button
              onClick={() => scrollCarousel('left')}
              className="p-2 border border-white/10 rounded-lg hover:bg-white/5 hover:text-white transition-colors focus:outline-none"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="p-2 border border-white/10 rounded-lg hover:bg-white/5 hover:text-white transition-colors focus:outline-none"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Deck */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4"
        >
          {loading
            ? [1, 2, 3, 4].map((i) => (
                <div key={i} className="w-64 flex-shrink-0">
                  <BookCardSkeleton />
                </div>
              ))
            : featured.map((book) => (
                <motion.div
                  key={book._id}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="w-64 flex-shrink-0 snap-start"
                >
                  <Link
                    to={`/books/${book._id}`}
                    className="block bg-darkCard border border-white/5 rounded-2xl p-4 shadow-[0_15px_30px_rgba(0,0,0,0.4)] hover:border-brand-500/20 transition-all flex flex-col justify-between h-full relative"
                  >
                    <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 relative border border-white/5">
                      <ImageWithFallback
                        src={book.coverImage ? (book.coverImage.startsWith('http') ? book.coverImage : `${import.meta.env.VITE_ASSET_URL || 'http://localhost:5000'}/${book.coverImage.replace(/\\/g, '/')}`) : null}
                        alt={book.title}
                        title={book.title}
                        className="w-full h-full object-cover"
                      />
                      {book.ratings?.average > 0 && (
                        <div className="absolute top-3 right-3 bg-darkCard/90 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                          <span>{book.ratings.average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white line-clamp-1 font-display text-sm">
                        {book.title}
                      </h3>
                      <p className="text-slate-500 text-xs mt-1">by {book.author}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-white font-extrabold text-sm">₹{book.price}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2 py-1 rounded-lg border border-brand-500/10">
                        View
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </section>

      {/* Animated statistics section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4">
        <StatsSection stats={stats} />
      </section>

      {/* Best Sellers Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white flex items-center gap-2.5">
              <Flame className="w-6 h-6 text-brand-400" /> Best Sellers
            </h2>
            <p className="text-slate-500 mt-1 text-xs sm:text-sm">The most popular stories flying off the shelves</p>
          </div>
          <Link to={BOOKS} className="text-brand-400 hover:text-brand-300 font-semibold text-xs uppercase tracking-wider flex items-center gap-1">
            See All <ArrowRight className="w-4.5 h-4.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading
            ? [1, 2, 3, 4].map((i) => <BookCardSkeleton key={i} />)
            : bestSellers.slice(0, 4).map((book) => (
                <motion.div
                  key={book._id}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="h-full"
                >
                  <Link
                    to={`/books/${book._id}`}
                    className="group flex flex-col justify-between h-full bg-darkCard border border-white/5 rounded-2xl p-4 shadow-[0_15px_30px_rgba(0,0,0,0.4)] hover:border-brand-500/20 transition-all"
                  >
                    <div>
                      <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 relative border border-white/5">
                        <ImageWithFallback
                          src={book.coverImage ? (book.coverImage.startsWith('http') ? book.coverImage : `${import.meta.env.VITE_ASSET_URL || 'http://localhost:5000'}/${book.coverImage.replace(/\\/g, '/')}`) : null}
                          alt={book.title}
                          title={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1 font-display text-sm">
                        {book.title}
                      </h3>
                      <p className="text-slate-500 text-xs mt-1">by {book.author}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-white font-extrabold text-sm">₹{book.price}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                        Details
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </section>
    </div>
  );
};

// Reusable BookCard internal component
export const BookCard = ({ book }) => {
  const imageUrl = book.coverImage
    ? book.coverImage.startsWith('http') ? book.coverImage : `${import.meta.env.VITE_ASSET_URL || 'http://localhost:5000'}/${book.coverImage.replace(/\\/g, '/')}`
    : null;

  return (
    <Link
      to={`/books/${book._id}`}
      className="group flex flex-col justify-between h-full bg-darkCard border border-white/5 rounded-2xl p-4 shadow-[0_15px_30px_rgba(0,0,0,0.4)] hover:border-brand-500/20 transition-all"
    >
      <div>
        <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 relative border border-white/5">
          <ImageWithFallback
            src={imageUrl}
            alt={book.title}
            title={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {book.ratings?.average > 0 && (
            <div className="absolute top-3 right-3 bg-darkCard/90 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
              <span>{book.ratings.average.toFixed(1)}</span>
            </div>
          )}
        </div>
        <h3 className="font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1 font-display text-sm">
          {book.title}
        </h3>
        <p className="text-slate-500 text-xs mt-1">by {book.author}</p>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-white font-extrabold text-sm">₹{book.price}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
          Details
        </span>
      </div>
    </Link>
  );
};

// Internal sub-component for animating statistics counter
const StatsSection = ({ stats }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-darkCard/55 border border-white/5 p-8 md:p-12 rounded-3xl backdrop-blur-xl shadow-2xl relative"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(99,102,241,0.04),transparent_50%)] pointer-events-none" />

      {/* Stat 1 */}
      <div className="flex items-center gap-5 text-left">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/15 flex items-center justify-center text-brand-400">
          <Library className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-3xl md:text-4xl font-extrabold text-white font-display">
            {isInView ? `${stats.books}+` : '0+'}
          </h4>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">Premium Titles</p>
        </div>
      </div>

      {/* Stat 2 */}
      <div className="flex items-center gap-5 text-left border-t border-white/5 md:border-t-0 md:border-l md:border-r border-white/5 py-6 md:py-0 md:px-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/15 flex items-center justify-center text-brand-400">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-3xl md:text-4xl font-extrabold text-white font-display">
            {isInView ? `${stats.users}+` : '0+'}
          </h4>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">Active Readers</p>
        </div>
      </div>

      {/* Stat 3 */}
      <div className="flex items-center gap-5 text-left">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/15 flex items-center justify-center text-brand-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-3xl md:text-4xl font-extrabold text-white font-display">
            {isInView ? `${stats.orders}+` : '0+'}
          </h4>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">Fulfilled Orders</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
