"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import he from "he";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HorizontalScroll({ posts, title = "الأكثر قراءة" }) {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const [paginationEl, setPaginationEl] = useState(null);

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section
      className="container mx-auto px-3 py-8 bg-gray-50 p-3 pb-5"
      dir="ltr"
    >
      {/* Section Header with Title and Arrows */}
      <div className="flex items-center justify-between mb-6" dir="rtl">
        <h2 className="text-3xl font-bold border-b-4 border-primary pb-2 inline-block">
          {title}
        </h2>

        {/* Custom Navigation Arrows */}
        <div className="flex gap-2">
          <button
            ref={(node) => setPrevEl(node)}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-sm cursor-pointer"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <button
            ref={(node) => setNextEl(node)}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-sm cursor-pointer"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Swiper Container */}
      <div className="relative horizontal-scroll-swiper group/swiper">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1.2}
          navigation={{
            prevEl,
            nextEl,
          }}
          pagination={{
            el: paginationEl,
            clickable: true,
            dynamicBullets: true,
          }}
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 2.2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3.2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
          className="w-full py-4"
          dir="rtl"
        >
          {posts.map((post, index) => (
            <SwiperSlide key={post.id} className="h-auto mb-5">
              <Link
                href={`/${post.id}/${post.slug}`}
                className="block h-full group"
              >
                <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  {/* Number Badge */}
                  <div className="relative">
                    <div className="absolute top-3 right-3 z-10 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-base shadow-lg">
                      {index + 1}
                    </div>

                    {/* Image */}
                    <div className="relative h-48 bg-[url(/blace-holder.jpg)] bg-cover bg-center overflow-hidden">
                      {post.imageUrl && (
                        <Image
                          src={post.imageUrl}
                          alt={he.decode(post.title?.rendered || "")}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-1">
                      {he.decode(post.title?.rendered || "")}
                    </h4>
                    <div
                      className="text-gray-500 text-xs line-clamp-2 mt-auto"
                      dangerouslySetInnerHTML={{
                        __html: he.decode(post.excerpt?.rendered || ""),
                      }}
                    />
                  </div>
                </article>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination Container */}
        <div
          ref={(node) => setPaginationEl(node)}
          className="flex justify-center mt-6 gap-1"
        />
      </div>

      <style jsx global>{`
        .horizontal-scroll-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #cbd5e1;
          opacity: 1;
          transition: all 0.3s;
        }
        .horizontal-scroll-swiper .swiper-pagination-bullet-active {
          background: var(--primary);
          width: 20px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}
