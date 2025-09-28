import he from "he";
import Image from "next/image";
import apiMedia from "../_apis/apiMedia";
import Link from "next/link";

async function CategorieHero({ posts, categoriePage }) {
  // Get only first 4 posts
  const firstFourPosts = posts.slice(0, 4);

  const postsWithImages = await Promise.all(
    firstFourPosts.map(async (post) => {
      // Prefer pre-resolved imageUrl if available from internal API route
      let imageUrl = post.imageUrl || null;
      // Fallback: resolve via media endpoint if only featured_media (ID) exists
      if (!imageUrl && post.featured_media) {
        imageUrl = await apiMedia(post.featured_media);
      }
      return { ...post, imageUrl };
    })
  );

  // Destructure into separate variables
  const [post1, post2, post3, post4] = postsWithImages;

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 md:grid-rows-4 gap-4 md:p-0 p-3">
      <article className="md:col-span-3 md:row-span-4 bg-[url(/blace-holder.jpg)] bg-no-repeat bg-cover bg-center">
        {post1 && (
          <div key={post1.id} className="relative h-[300px] md:h-[405px] ">
            {/* categorie name */}
            <p className="absolute top-3 right-3 z-20 px-2 py-1 bg-primary font-medium text-white text-sm">
              {categoriePage}
            </p>
            {post1.imageUrl && (
              <Image
                src={post1.imageUrl}
                alt={he.decode(post1.title.rendered)}
                fill
                className="object-cover z-2"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            <Link href={`/${post1.id}/${post1.slug}`}>
              <div className="flex flex-col justify-end items-start p-4 z-10 absolute h-full w-full bg-gradient-to-b from-slate-50/0 to-gray-800 text-white">
                <h4 className="line-clamp-2 text-xl md:text-2xl font-bold">
                  {he.decode(post1.title.rendered)}
                </h4>
                {/* <div
                className="line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: he.decode(post1.excerpt.rendered),
                  }}
              /> */}
              </div>
            </Link>
          </div>
        )}
      </article>

      <article className="md:col-span-2 md:row-span-4 md:col-start-4 bg-[url(/blace-holder.jpg)] bg-no-repeat bg-cover bg-center">
        {post2 && (
          <div key={post2.id} className="relative h-[300px] md:h-[405px]">
            <p className="absolute top-3 right-3 z-20 px-2 py-1 bg-primary font-medium text-white text-sm">
              {categoriePage}
            </p>
            {post2.imageUrl && (
              <Image
                src={post2.imageUrl}
                alt={he.decode(post2.title.rendered)}
                fill
                className="object-cover z-2"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            <Link href={`/${post2.id}/${post2.slug}`}>
              <div className="flex flex-col justify-end items-start p-4 z-10 absolute h-full w-full bg-gradient-to-b from-slate-50/0 to-gray-800 text-white">
                <h4 className="line-clamp-2 text-xl md:text-2xl font-bold">
                  {he.decode(post2.title.rendered)}
                </h4>
              </div>
            </Link>
          </div>
        )}
      </article>

      <article className="md:col-span-2 md:row-span-2 md:col-start-6 bg-[url(/blace-holder.jpg)] bg-no-repeat bg-cover bg-center">
        {post3 && (
          <div key={post3.id} className="relative h-[300px] md:h-full">
            <p className="absolute top-3 right-3 z-20 px-2 py-1 bg-primary font-medium text-white text-sm">
              {categoriePage}
            </p>
            {post3.imageUrl && (
              <Image
                src={post3.imageUrl}
                alt={he.decode(post3.title.rendered)}
                fill
                className="object-cover z-2"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            <Link href={`/${post3.id}/${post3.slug}`}>
              <div className="flex flex-col justify-end items-start p-4 z-10 absolute h-full w-full bg-gradient-to-b from-slate-50/0 to-gray-800 text-white">
                <h4 className="line-clamp-2 text-xl md:text-2xl font-bold">
                  {he.decode(post3.title.rendered)}
                </h4>
              </div>
            </Link>
          </div>
        )}
      </article>

      <article className="md:col-span-2 md:row-span-2 md:col-start-6 md:row-start-3 bg-[url(/blace-holder.jpg)] bg-no-repeat bg-cover bg-center">
        {post4 && (
          <div key={post4.id} className="relative h-[300px] md:h-full">
            <p className="absolute top-3 right-3 z-20 px-2 py-1 bg-primary font-medium text-white text-sm">
              {categoriePage}
            </p>{" "}
            {post4.imageUrl && (
              <Image
                src={post4.imageUrl}
                alt={he.decode(post4.title.rendered)}
                fill
                className="object-cover z-2"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            <Link href={`/${post4.id}/${post4.slug}`}>
              <div className="flex flex-col justify-end items-start p-4 z-10 absolute h-full w-full bg-gradient-to-b from-slate-50/0 to-gray-800 text-white">
                <h4 className="line-clamp-2 text-xl md:text-2xl font-bold">
                  {he.decode(post4.title.rendered)}
                </h4>
              </div>
            </Link>
          </div>
        )}
      </article>
    </div>
  );
}

export default CategorieHero;
