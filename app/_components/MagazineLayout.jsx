import he from "he";
import Image from "next/image";
import Link from "next/link";

export default function MagazineLayout({ posts, title = "تقارير خاصة" }) {
  if (!posts || posts.length === 0) {
    return null;
  }

  const mainPost = posts[0];
  const sidePosts = posts.slice(1, 4);

  return (
    <section className="container mx-auto px-3 py-8">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold border-b-4 border-primary pb-2 inline-block">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Large Featured Post - Left Side */}
        <Link href={`/${mainPost.id}/${mainPost.slug}`} className="group">
          <article className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
            {/* Large Image */}
            <div className="relative h-[400px] bg-[url(/blace-holder.jpg)] bg-cover bg-center overflow-hidden">
              {mainPost.imageUrl && (
                <Image
                  src={mainPost.imageUrl}
                  alt={he.decode(mainPost.title?.rendered || "")}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
              {/* Category Badge */}
              <div className="absolute top-4 right-4 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-lg">
                تقرير خاص
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                {he.decode(mainPost.title?.rendered || "")}
              </h3>
              <div
                className="text-gray-600 text-base line-clamp-3 mb-4 flex-1"
                dangerouslySetInnerHTML={{
                  __html: he.decode(mainPost.excerpt?.rendered || ""),
                }}
              />
              <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                <span>اقرأ المزيد</span>
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
                  className="mr-2"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
          </article>
        </Link>

        {/* Right Side - 3 Smaller Posts */}
        <div className="flex flex-col gap-4">
          {sidePosts.map((post) => (
            <Link
              key={post.id}
              href={`/${post.id}/${post.slug}`}
              className="group flex-1"
            >
              <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-row">
                {/* Image - Left */}
                <div className="relative w-40 md:w-48 flex-shrink-0 bg-[url(/blace-holder.jpg)] bg-cover bg-center overflow-hidden">
                  {post.imageUrl && (
                    <Image
                      src={post.imageUrl}
                      alt={he.decode(post.title?.rendered || "")}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 160px, 192px"
                    />
                  )}
                </div>

                {/* Content - Right */}
                <div className="p-4 flex-1 flex flex-col justify-center">
                  <h4 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {he.decode(post.title?.rendered || "")}
                  </h4>
                  <div
                    className="text-gray-600 text-sm line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: he.decode(post.excerpt?.rendered || ""),
                    }}
                  />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
