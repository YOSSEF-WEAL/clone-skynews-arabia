import he from "he";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import apiGetPostBySlug from "../../_apis/apiGetPostBySlug";
import apiPostesCategorie from "../../_apis/apiPostesCategorie";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ShareButtons from "../../_components/ShareButtons";

// Add this function at the top level
async function getPostData(slug) {
  const post = await apiGetPostBySlug(slug);
  if (!post) return null;

  // Get tags names from _embedded data
  const tagNames =
    post?._embedded?.["wp:term"]?.[1]?.map((tag) => tag.name) || [];

  // Get featured image from _embedded data
  const featuredImageUrl =
    post?.featuredImage ||
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    null;

  // Get related posts
  let sidebarPosts = [];
  const primaryCategoryId = Array.isArray(post?.categories)
    ? post.categories[0]
    : null;
  if (primaryCategoryId) {
    try {
      const catPosts = await apiPostesCategorie(primaryCategoryId);
      sidebarPosts = catPosts
        .filter((p) => p.id !== post.id)
        .slice(0, 6)
        .map((p) => ({
          ...p,
          imageUrl: p?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
        }));
    } catch (_) {}
  }

  return {
    post,
    featuredImageUrl,
    sidebarPosts,
    tagNames,
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getPostData(slug);
  if (!data) return {};

  const { post, featuredImageUrl } = data;
  const title = he.decode(post.title?.rendered || "");
  const description = he
    .decode(post.excerpt?.rendered || "")
    .replace(/<[^>]*>/g, "")
    .slice(0, 160);

  const canonicalPath = `/${post.id}/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: "article",
      siteName: "A3raff News",
      locale: "ar_EG",
      images: [featuredImageUrl || "/favicon.ico"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [featuredImageUrl || "/favicon.ico"],
    },
  };
}

// Move the options outside the component to maintain SSR
const parseOptions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.name === "img") {
      const imgWidth = parseInt(domNode.attribs.width) || 800;
      const imgHeight =
        parseInt(domNode.attribs.height) || Math.round(imgWidth * 0.6);

      return (
        <Image
          src={domNode.attribs.src}
          alt={domNode.attribs.alt || ""}
          width={imgWidth}
          height={imgHeight}
          quality={100}
          className="w-full h-auto my-4 "
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          priority={false}
        />
      );
    }
  },
};

export default async function PostBySlug({ params }) {
  const { slug } = params;
  const data = await getPostData(slug);
  console.log("🚀 ~ PostBySlug ~ data:", data);

  if (!data) return <div>Post not found</div>;

  const { post, featuredImageUrl, sidebarPosts, tagNames } = data;
  const title = he.decode(post.title?.rendered || "");
  const contentHtml = he.decode(post.content?.rendered || "");

  return (
    <main className="container mx-auto py-6 px-3">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <article className="lg:col-start-1 lg:col-span-9">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">{title}</h1>
          {!featuredImageUrl ? (
            <div className="relative w-full h-72 md:h-110 mb-6 bg-[url(/blace-holder.jpg)] bg-no-repeat bg-cover bg-center"></div>
          ) : (
            <div className="relative w-full h-72 md:h-110 mb-6 bg-[url(/blace-holder.jpg)] bg-no-repeat bg-cover bg-center">
              <Image
                src={featuredImageUrl}
                alt={title}
                fill
                className="object-cover "
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 75vw"
              />
            </div>
          )}

          <div className="w-full my-2 flex items-center justify-between gap-3">
            <Button variant={"gost"}>
              <Avatar>
                <AvatarImage src={post?.authorImage} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {post?.authorName}
            </Button>

            <ShareButtons title={title} />
          </div>
          <div className="prose max-w-none prose-p:leading-8 prose-ul:list-disc prose-ol:list-decimal  prose-img:shadow-lg rich">
            {parse(contentHtml, parseOptions)}
          </div>
          {/* ads */}
          <div className="relative w-full h-20">
            <Image
              src="/test-ads.jpg"
              className="object-contain"
              alt="ads"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          {/* tags */}
          <div className="w-full mt-4 flex gap-2 flex-row flex-wrap">
            {tagNames.map(
              (tagName, i) =>
                tagName && (
                  <div
                    key={i}
                    className="px-2 py-1.5 bg-gray-200 border-r-4 border-primary text-base font-semibold transition-all hover:bg-primary hover:text-white hover:border-gray-900"
                  >
                    {tagName}
                  </div>
                )
            )}
          </div>
        </article>

        <aside className="lg:col-start-10 lg:col-span-3 space-y-4">
          <h2 className="text-xl font-bold">آخر أخبار القسم</h2>
          <div className="space-y-4">
            {sidebarPosts.map((sp) => (
              <div key={sp.id} className="flex items-start gap-3">
                <div className="relative w-24 h-16 flex-shrink-0 bg-gray-200  overflow-hidden bg-[url(/blace-holder.jpg)] bg-no-repeat bg-cover bg-center">
                  {sp.imageUrl && (
                    <Link href={`/${sp.id}/${sp.slug}`}>
                      <Image
                        src={sp.imageUrl}
                        alt={he.decode(sp.title?.rendered || "")}
                        fill
                        className="object-cover "
                        sizes="96px"
                      />
                    </Link>
                  )}
                </div>
                <div className="flex-1">
                  <Link
                    href={`/${sp.id}/${sp.slug}`}
                    className="line-clamp-2 font-medium hover:underline"
                  >
                    {he.decode(sp.title?.rendered || "")}
                  </Link>
                </div>
              </div>
            ))}
            {sidebarPosts.length === 0 && (
              <p className="text-sm text-gray-500">لا توجد أخبار متاحة.</p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
