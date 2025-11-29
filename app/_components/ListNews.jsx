import he from "he";
import Image from "next/image";
import Link from "next/link";

export default function ListNews({ posts, categoriePage }) {
  return (
    <div className="px-4">
      <div className="w-full my-8">
        <p className="text-2xl w-fit font-bold border-b-4 pb-2 border-primary">
          {categoriePage || "اخر الاخبار"}
        </p>
      </div>
      <div className="w-full flex flex-row flex-wrap gap-3  items-start">
        {posts.map((post) => (
          <article key={post.id} className="relative w-[48%] md:w-[32%] gap-2">
            {post && (
              <>
                {/* categorie name */}
                <p className="absolute top-3 right-3 z-20 px-2 py-1 bg-primary font-medium text-white text-sm">
                  {categoriePage}
                </p>
                <div className="relative w-full h-40 md:h-60 bg-[url(/blace-holder.jpg)] bg-no-repeat bg-cover bg-center">
                  <Link href={`/${post.id}/${post.slug}`}>
                    <Image
                      src={post.imageUrl || "/blace-holder.jpg"}
                      alt={he.decode(post.title?.rendered || "")}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </Link>
                </div>
                <div className="flex flex-col justify-end items-start mt-2 w-full  text-gray-900">
                  <Link
                    href={`/${post.id}/${post.slug}`}
                    className="line-clamp-2 text-xl md:text-1xl font-bold"
                  >
                    {he.decode(post.title.rendered)}
                  </Link>
                  <div
                    className="line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: he.decode(post.excerpt.rendered),
                    }}
                  />
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
