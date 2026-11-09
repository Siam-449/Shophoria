
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { useProducts } from '../context/ProductsContext.jsx';
import { getBanners, subscribeToBanners } from '../lib/firebase.js';
import { motion } from 'motion/react';

const Hero = () => {
  const { products } = useProducts();
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isManuallyMuted, setIsManuallyMuted] = useState(false);
  const videoRefs = useRef({});

  // Fetch or subscribe to dynamic banners from Firebase
  useEffect(() => {
    let unsubscribe = null;
    const loadBanners = async () => {
      try {
        const fetchedBanners = await getBanners();
        if (fetchedBanners && fetchedBanners.length > 0) {
          setBanners(fetchedBanners);
        }
      } catch (err) {
        console.error('Error loading banners:', err);
      }
    };
    loadBanners();

    if (typeof subscribeToBanners === 'function') {
      unsubscribe = subscribeToBanners((liveBanners) => {
        if (liveBanners && liveBanners.length > 0) {
          setBanners(liveBanners);
        }
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const totalSlides = banners.length;

  const nextSlide = useCallback(() => {
    if (totalSlides > 1) {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides > 1) {
      setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  }, [totalSlides]);

  // Auto transition to next slide if 2 or more slides, paused on hover
  useEffect(() => {
    if (totalSlides < 2 || isHovered) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides, isHovered, nextSlide]);

  const isVideoSlide = (slide) => {
    if (!slide) return false;
    if (slide.type === 'video') return true;
    const url = slide.videoUrl || slide.url || '';
    return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
  };

  // Ensure current video plays when active and syncs initial mute state
  useEffect(() => {
    const currentSlide = banners[currentIndex];
    if (currentSlide && isVideoSlide(currentSlide)) {
      const vid = videoRefs.current[currentIndex];
      if (vid) {
        const shouldMute = isHovered ? isManuallyMuted : true;
        vid.muted = shouldMute;
        setIsMuted(shouldMute);
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
    }
  }, [currentIndex, banners, isHovered, isManuallyMuted]);

  // Direct sync of DOM muted property with active video
  useEffect(() => {
    const vid = videoRefs.current[currentIndex];
    if (vid) {
      vid.muted = isMuted;
    }
  }, [isMuted, currentIndex]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    const current = banners[currentIndex];
    if (current && isVideoSlide(current)) {
      if (!isManuallyMuted) {
        setIsMuted(false);
        const vid = videoRefs.current[currentIndex];
        if (vid) {
          vid.muted = false;
        }
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const current = banners[currentIndex];
    if (current && isVideoSlide(current)) {
      setIsMuted(true);
      const vid = videoRefs.current[currentIndex];
      if (vid) {
        vid.muted = true;
      }
    }
  };

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMuted) {
      // User clicked Unmute -> unmute and reset manual mute lock
      setIsMuted(false);
      setIsManuallyMuted(false);
      const vid = videoRefs.current[currentIndex];
      if (vid) {
        vid.muted = false;
      }
    } else {
      // User clicked Mute -> stay muted no matter if hovered again until unmuted
      setIsMuted(true);
      setIsManuallyMuted(true);
      const vid = videoRefs.current[currentIndex];
      if (vid) {
        vid.muted = true;
      }
    }
  };

  // Helper to dynamically link banner to products page or specific product
  const getSlideLink = (slide) => {
    if (slide.link) return slide.link;
    if (slide.productSlug) return `/products/${slide.productSlug}`;
    if (slide.productId) {
      const match = products?.find((p) => p.id === slide.productId);
      return match ? `/products/${match.slug}` : `/products/${slide.productId}`;
    }
    // Default link to first product or products catalogue
    if (products && products.length > 0) {
      return `/products/${products[0].slug}`;
    }
    return '/products';
  };

  if (!banners || banners.length === 0) {
    return (
      <section className="w-full py-4 sm:py-6">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full min-h-[180px] sm:min-h-[550px] aspect-[16/7] sm:aspect-[1917/750] rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-md sm:shadow-lg" />
        </div>
      </section>
    );
  }

  const currentSlide = banners[currentIndex];
  const isCurrentVideo = currentSlide && isVideoSlide(currentSlide);

  return (
    <section className="w-full py-4 sm:py-6">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative w-full min-h-[180px] sm:min-h-[550px] aspect-[16/7] sm:aspect-[1917/750] rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-md sm:shadow-lg group select-none"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Carousel Track with smooth horizontal transition */}
          <div
            className="flex w-full h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((slide, idx) => {
              const isVideo = isVideoSlide(slide);
              const targetLink = getSlideLink(slide);
              const mediaUrl = slide.videoUrl || slide.url || slide.image;

              return (
                <div key={slide.id || idx} className="relative w-full h-full flex-shrink-0">
                  <Link
                    href={targetLink}
                    className="block w-full h-full cursor-pointer relative overflow-hidden"
                    aria-label={slide.alt || 'Featured Product Banner'}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="w-full h-full"
                    >
                      {/* Primary Media Layer (Stretched to Fill) */}
                      {isVideo ? (
                        <video
                          ref={(el) => (videoRefs.current[idx] = el)}
                          src={mediaUrl}
                          autoPlay
                          loop
                          muted={isMuted}
                          playsInline
                          className="w-full h-full object-fill"
                        />
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={slide.alt || "Shophoria Banner"}
                          className="w-full h-full object-fill"
                          loading={idx === 0 ? "eager" : "lazy"}
                        />
                      )}
                    </motion.div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Left Arrow Button */}
          {totalSlides > 1 && (
            <button
              type="button"
              aria-label="Previous slide"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 opacity-90 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>
          )}

          {/* Right Arrow Button */}
          {totalSlides > 1 && (
            <button
              type="button"
              aria-label="Next slide"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 opacity-90 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
            </button>
          )}

          {/* Slide Indicators (Pills / Dots at bottom center) */}
          {totalSlides > 1 && (
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    currentIndex === idx
                      ? 'w-6 sm:w-8 h-1.5 sm:h-2 bg-white shadow-sm'
                      : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Video Mute / Unmute Button (Shown when current slide is video) */}
          {isCurrentVideo && (
            <button
              type="button"
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              onClick={toggleMute}
              className="absolute bottom-3 right-3 sm:bottom-4 sm:right-5 z-20 p-2 sm:px-3 sm:py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all duration-200 opacity-90 group-hover:opacity-100 hover:scale-105 flex items-center gap-1.5 text-xs font-semibold shadow-lg"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-white" />
                  <span className="hidden sm:inline">Unmute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-white" />
                  <span className="hidden sm:inline">Mute</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;