import he from "he";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedGrid({ posts, title = "أبرز الأخبار" }) {
  if (!posts || posts.length === 0) {
    return null;
  }

  const featuredPost = posts[0];
  const gridPosts = posts.slice(1, 7);

  return (
    <section className="container mx-auto px-3 py-8">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold border-b-4 border-primary pb-2 inline-block">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Featured Large Post - Spans 2 columns on lg */}
        <Link
          href={`/${featuredPost.id}/${featuredPost.slug}`}
          className="md:col-span-2 lg:row-span-2 relative group overflow-hidden rounded-xl bg-[url(/blace-holder.jpg)] bg-cover bg-center h-[400px] lg:h-full"
        >
          {featuredPost.imageUrl && (
            <Image
              src={featuredPost.imageUrl}
              alt={he.decode(featuredPost.title?.rendered || "")}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 66vw"
            />
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 line-clamp-3 group-hover:text-primary transition-colors">
              {he.decode(featuredPost.title?.rendered || "")}
            </h3>
            <div
              className="text-gray-200 line-clamp-2 hidden md:block"
              dangerouslySetInnerHTML={{
                __html: he.decode(featuredPost.excerpt?.rendered || ""),
              }}
            />
          </div>
        </Link>

        {/* Grid Posts */}
        {gridPosts.map((post) => (
          <Link
            key={post.id}
            href={`/${post.id}/${post.slug}`}
            className="group"
          >
            <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              {/* Image */}
              <div className="relative h-48 bg-[url(/blace-holder.jpg)] bg-cover bg-center overflow-hidden">
                {post.imageUrl && (
                  <Image
                    src={post.imageUrl}
                    alt={he.decode(post.title?.rendered || "")}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <h4 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {he.decode(post.title?.rendered || "")}
                </h4>
                <div
                  className="text-gray-600 text-sm line-clamp-2 flex-1"
                  dangerouslySetInnerHTML={{
                    __html: he.decode(post.excerpt?.rendered || ""),
                  }}
                />
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
