import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    badge: 'SUMMER TECH REVOLUTION',
    title: 'Next-Gen Noise Cancelling Headphones',
    subtitle: 'Immerse yourself in acoustic perfection with 40-hour battery life and studio-grade clarity.',
    priceText: 'From $199.99',
    ctaText: 'Shop Electronics',
    link: '/shop?category=electronics',
    bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
    accentColor: 'text-indigo-400',
    buttonColor: 'bg-indigo-600 hover:bg-indigo-500',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    badge: 'NEW ARRIVALS 2024',
    title: 'Designer Minimalist Smartwatches',
    subtitle: 'Aerospace-grade titanium, sapphire glass, with advanced fitness metrics and seamless sync.',
    priceText: 'Save up to 35%',
    ctaText: 'Discover Collection',
    link: '/shop?category=electronics',
    bgGradient: 'from-slate-900 via-blue-950 to-slate-900',
    accentColor: 'text-cyan-400',
    buttonColor: 'bg-cyan-600 hover:bg-cyan-500',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    badge: 'CURATED LUXURY & STYLE',
    title: 'Handcrafted Heritage Leather Accessories',
    subtitle: 'Full-grain vegetable tanned Italian leather designed for enduring elegance and lifetime utility.',
    priceText: 'Starting at $79.99',
    ctaText: 'Explore Fashion',
    link: '/shop?category=fashion',
    bgGradient: 'from-stone-900 via-amber-950 to-stone-900',
    accentColor: 'text-amber-400',
    buttonColor: 'bg-amber-600 hover:bg-amber-500',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
  },
];

export const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-900 my-4">
      <div className={`w-full min-h-[440px] md:min-h-[500px] bg-gradient-to-r ${slide.bgGradient} flex items-center transition-all duration-700`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-12 w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Text Left */}
          <div className="md:col-span-7 space-y-4 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-white tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {slide.badge}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {slide.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
              {slide.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to={slide.link}
                className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold text-sm transition shadow-lg hover:shadow-indigo-500/25 ${slide.buttonColor}`}
              >
                {slide.ctaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium backdrop-blur-sm">
                <span className="text-slate-400">Offer: </span>
                <span className={`font-bold ${slide.accentColor}`}>{slide.priceText}</span>
              </div>
            </div>
          </div>

          {/* Image Right */}
          <div className="md:col-span-5 flex justify-center items-center relative">
            <div className="w-64 h-64 sm:w-80 sm:h-80 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-radial from-brand-500/20 to-transparent blur-2xl rounded-full" />
              <img
                src={slide.image}
                alt={slide.title}
                className="max-h-full max-w-full object-contain drop-shadow-2xl rounded-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition shadow-md"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition shadow-md"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
