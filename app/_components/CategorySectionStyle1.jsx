import he from "he";
import Image from "next/image";
import Link from "next/link";
import { getCategoryPosts } from "../_apis/getCategoryPosts";

export default async function CategorySectionStyle1({ categorySlug, title }) {
  const posts = await getCategoryPosts(categorySlug, 5);

  if (!posts || posts.length === 0) {
    return null;
  }

  const mainPost = posts[0];
  const listPosts = posts.slice(1, 5);

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Post - Large Right */}
        <Link
          href={`/${mainPost.id}/${mainPost.slug}`}
          className="lg:col-span-2 group"
        >
          <article className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-lg">
            {mainPost.imageUrl && (
              <Image
                src={mainPost.imageUrl}
                alt={he.decode(mainPost.title?.rendered || "")}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors line-clamp-2">
                {he.decode(mainPost.title?.rendered || "")}
              </h3>
              <div
                className="text-gray-200 line-clamp-2 hidden md:block "
                dangerouslySetInnerHTML={{
                  __html: he.decode(mainPost.excerpt?.rendered || ""),
                }}
              />
            </div>
          </article>
        </Link>

        {/* List Posts - Left */}
        <div className="flex flex-col gap-4">
          {listPosts.map((post) => (
            <Link
              key={post.id}
              href={`/${post.id}/${post.slug}`}
              className="group flex gap-4 items-start bg-white p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                {post.imageUrl && (
                  <Image
                    src={post.imageUrl}
                    alt={he.decode(post.title?.rendered || "")}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="96px"
                  />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold line-clamp-2 group-hover:text-primary transition-colors mb-1">
                  {he.decode(post.title?.rendered || "")}
                </h4>
                <span className="text-xs text-gray-500">
                  {new Date(post.date).toLocaleDateString("ar-EG")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
