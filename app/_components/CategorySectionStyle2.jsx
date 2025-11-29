import he from "he";
import Image from "next/image";
import Link from "next/link";
import { getCategoryPosts } from "../_apis/getCategoryPosts";

export default async function CategorySectionStyle2({ categorySlug, title }) {
  const posts = await getCategoryPosts(categorySlug, 4);

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-3 py-8 bg-gray-50">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/${post.id}/${post.slug}`}
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
          >
            <div className="relative h-48 bg-gray-200 overflow-hidden">
              {post.imageUrl && (
                <Image
                  src={post.imageUrl}
                  alt={he.decode(post.title?.rendered || "")}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              )}
              {/* Category Badge (Optional) */}
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                {title || "أخبار"}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {he.decode(post.title?.rendered || "")}
              </h3>
              <div
                className="text-gray-600 text-sm line-clamp-3 flex-1"
                dangerouslySetInnerHTML={{
                  __html: he.decode(post.excerpt?.rendered || ""),
                }}
              />
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-xs text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {new Date(post.date).toLocaleDateString("ar-EG")}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
