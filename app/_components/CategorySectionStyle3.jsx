import he from "he";
import Image from "next/image";
import Link from "next/link";
import { getCategoryPosts } from "../_apis/getCategoryPosts";

export default async function CategorySectionStyle3({ categorySlug, title }) {
  const posts = await getCategoryPosts(categorySlug, 5);

  if (!posts || posts.length === 0) {
    return null;
  }

  // First post is large, others are small overlay cards
  const mainPost = posts[0];
  const subPosts = posts.slice(1, 5);

  return (
    <section className="container mx-auto px-3 py-8">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-6 border-b-2 border-gray-200 pb-2">
        <h2 className="text-2xl md:text-3xl font-bold text-primary border-b-2 border-primary -mb-2.5 pb-2 px-2">
          {title || categorySlug}
        </h2>
        <Link
          href={`/category/${categorySlug}`}
          className="text-sm font-semibold text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
        >
          المزيد
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[600px] md:h-[500px]">
        {/* Main Large Post - Spans 2 cols, 2 rows (full height on desktop) */}
        <Link
          href={`/${mainPost.id}/${mainPost.slug}`}
          className="md:col-span-2 lg:col-span-2 md:row-span-2 relative group rounded-xl overflow-hidden"
        >
          {mainPost.imageUrl && (
            <Image
              src={mainPost.imageUrl}
              alt={he.decode(mainPost.title?.rendered || "")}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <span className="inline-block px-2 py-1 bg-primary text-white text-xs font-bold rounded mb-2">
              رئيسي
            </span>
            <h3 className="text-2xl md:text-3xl font-bold mb-2 line-clamp-3 group-hover:text-primary transition-colors">
              {he.decode(mainPost.title?.rendered || "")}
            </h3>
          </div>
        </Link>

        {/* Sub Posts - 2x2 Grid on right */}
        {subPosts.map((post) => (
          <Link
            key={post.id}
            href={`/${post.id}/${post.slug}`}
            className="relative group rounded-xl overflow-hidden min-h-[150px]"
          >
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={he.decode(post.title?.rendered || "")}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <h4 className="text-sm md:text-base font-bold line-clamp-2 group-hover:text-primary transition-colors">
                {he.decode(post.title?.rendered || "")}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
