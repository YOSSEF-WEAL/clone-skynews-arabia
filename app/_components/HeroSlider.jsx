"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import he from "he";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroSlider({ posts }) {
  if (!posts || posts.length === 0) {
    return null;
  }

  // Chunk posts into groups of 3 for each slide
  const slides = [];
  for (let i = 0; i < posts.length; i += 3) {
    slides.push(posts.slice(i, i + 3));
  }

  // Ensure we have at least one slide
  if (slides.length === 0) return null;

  return (
    <section className="container mx-auto px-3 py-8" dir="ltr">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-[600px] rounded-xl  hero-swiper"
        dir="rtl"
      >
        {slides.map((slidePosts, slideIndex) => {
          const mainPost = slidePosts[0];
          const sidePosts = slidePosts.slice(1, 3);

          return (
            <SwiperSlide key={slideIndex}>
              <div
                className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full"
                dir="rtl"
              >
                {/* Main Hero - Large (Right Side in RTL) */}
                {mainPost && (
                  <Link
                    href={`/${mainPost.id}/${mainPost.slug}`}
                    className="lg:col-span-2 relative group overflow-hidden rounded-xl bg-gray-200 h-full block"
                  >
                    <div className="relative w-full h-full">
                      {mainPost.imageUrl && (
                        <Image
                          src={mainPost.imageUrl}
                          alt={he.decode(mainPost.title?.rendered || "")}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 1024px) 100vw, 66vw"
                          priority={slideIndex === 0}
                        />
                      )}
                      {/* Gradient Overlay - Stronger for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10">
                        <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-semibold rounded mb-3 shadow-sm">
                          أبرز الأخبار
                        </span>
                        <h2 className="text-lg md:text-xl lg:text-3xl font-bold mb-3 line-clamp-3 group-hover:text-primary transition-colors drop-shadow-md leading-tight">
                          {he.decode(mainPost.title?.rendered || "")}
                        </h2>
                        <div
                          className="text-gray-100 text-sm md:text-base line-clamp-2 drop-shadow-sm font-medium"
                          dangerouslySetInnerHTML={{
                            __html: he.decode(mainPost.excerpt?.rendered || ""),
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                )}

                {/* Side Posts - Stacked (Left Side in RTL) */}
                <div className="flex flex-col gap-4 h-full lg:col-span-1">
                  {sidePosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/${post.id}/${post.slug}`}
                      className="relative group overflow-hidden rounded-xl bg-gray-200 flex-1 block"
                    >
                      <div className="relative w-full h-full">
                        {post.imageUrl && (
                          <Image
                            src={post.imageUrl}
                            alt={he.decode(post.title?.rendered || "")}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                          />
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white z-10">
                          <h3 className="text-base md:text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors drop-shadow-md leading-snug">
                            {he.decode(post.title?.rendered || "")}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <style jsx global>{`
        .hero-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background: #d71920; /* Primary Color */
          width: 24px;
          border-radius: 5px;
        }
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          background: var(--primary);
          padding: 7px;
          border-radius: 50px;
        }
        .hero-swiper .swiper-button-next:after,
        .hero-swiper .swiper-button-prev:after {
          font-size: 24px;
          font-weight: bold;
        }
        .hero-swiper .swiper-pagination {
          display: none;
        }
      `}</style>
    </section>
  );
}
