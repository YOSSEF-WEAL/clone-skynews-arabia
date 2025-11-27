import he from "he";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import { redirect } from "next/navigation";
import apiGetPostBySlug from "../../_apis/apiGetPostBySlug";
import apiPostesCategorie from "../../_apis/apiPostesCategorie";
import apiGetPostById from "../../_apis/apiGetPostById";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ShareButtons from "../../_components/ShareButtons";

async function getPostData(idParam, slugParam) {
  let resolvedSlug = slugParam;
  let resolvedId = idParam;

  // Resolve canonical slug (and id) via the numeric id when available
  if (/^\d+$/.test(String(idParam))) {
    const postById = await apiGetPostById(idParam);
    if (postById) {
      resolvedSlug = postById.slug || resolvedSlug || String(idParam);
      resolvedId = postById.id || idParam;
    }
  }

  const fallbackSlug = resolvedSlug || slugParam || String(idParam);
  const post = await apiGetPostBySlug(fallbackSlug);
  if (!post) return { post: null, resolvedSlug: fallbackSlug, resolvedId };

  const tags = post?.tags || [];

  const featuredImageUrl =
    post?.featuredImage ||
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    null;

  let sidebarPosts = [];
  const primaryCategoryId = Array.isArray(post?.categories)
    ? post.categories[0]
    : null;
  if (primaryCategoryId) {
    try {
      // Fetch more posts to ensure we have enough after filtering current post
      const { posts: catPosts } = await apiPostesCategorie(
        primaryCategoryId,
        1,
        15
      );
      sidebarPosts = (catPosts || [])
        .filter((p) => p.id !== post.id)
        .slice(0, 10)
        .map((p) => {
          const resolvedImage =
            p?.imageUrl ||
            p?.featuredMedia ||
            p?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
            null;
          return {
            ...p,
            imageUrl: resolvedImage,
          };
        });
    } catch (err) {
      console.error("Error fetching sidebar posts:", err);
    }
  }

  return {
    post,
    resolvedSlug: post.slug || resolvedSlug || fallbackSlug,
    resolvedId,
    featuredImageUrl,
    sidebarPosts,
    tags,
  };
}

export async function generateMetadata({ params }) {
  const { id, slug } = await params;
  const data = await getPostData(id, slug);
  if (!data?.post) return {};

  const { post, featuredImageUrl, resolvedSlug, resolvedId } = data;
  const canonicalSlug = resolvedSlug || post.slug;
  const canonicalId = resolvedId || post.id;
  const title = he.decode(post.title?.rendered || "");
  const description = he
    .decode(post.excerpt?.rendered || "")
    .replace(/<[^>]*>/g, "")
    .slice(0, 160);

  const canonicalPath = `/${canonicalId}/${canonicalSlug}`;

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
  const { id, slug } = params;
  const data = await getPostData(id, slug);

  if (!data?.post) return <div>Post not found</div>;

  const { post, featuredImageUrl, sidebarPosts, tags } = data;

  const title = he.decode(post.title?.rendered || "");
  const contentHtml = he.decode(post.content?.rendered || "");

  // Format date in Arabic
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <main className="container mx-auto py-6 px-3">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <article className="lg:col-start-1 lg:col-span-9">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 mb-9">{title}</h1>

          {!featuredImageUrl ? (
            <div className="relative w-full h-72 md:h-110 mb-6 bg-[url(/blace-holder.jpg)] bg-no-repeat bg-cover bg-center"></div>
          ) : (
            <div className="relative w-full h-72 md:h-130 mb-6 bg-[url(/blace-holder.jpg)] bg-no-repeat bg-cover bg-center overflow-hidden rounded-lg ">
              <Image
                src={featuredImageUrl}
                alt={title}
                fill
                className="object-cover "
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 75vw transition-all duration-300 hover:scale-[1.1] "
              />
            </div>
          )}

          <div className="w-full my-2 flex items-center justify-between gap-3 mb-8">
            <Button variant={"gost"}>
              <Avatar>
                <AvatarImage src={post?.authorImage} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {post?.authorName}
            </Button>
            {/* Date Display */}
            <div className="flex items-center gap-2 text-gray-600 text-sm ">
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
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
            <ShareButtons title={title} />
          </div>

          <div className="prose max-w-none prose-p:leading-8 prose-ul:list-disc prose-ol:list-decimal  prose-img:shadow-lg rich p-4 bg-gray-200/60 rounded-lg mb-5">
            {parse(contentHtml, parseOptions)}
          </div>
          <div className="relative w-full h-20">
            <Image
              src="/test-ads.jpg"
              className="object-contain"
              alt="ads"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="w-full mt-4 flex gap-2 flex-row flex-wrap">
            {tags.map(
              (tag, i) =>
                tag?.name && (
                  <Link
                    key={i}
                    href={`/tag/${tag.slug}`}
                    className="px-2 py-1.5 bg-gray-200/60 rounded-lg border-r-4 border-primary text-base font-semibold transition-all hover:bg-primary hover:text-white hover:border-gray-900"
                  >
                    {tag.name}
                  </Link>
                )
            )}
          </div>
        </article>

        <aside className="lg:col-start-10 lg:col-span-3 space-y-4">
          <h2 className="text-xl font-bold">أبرز الأخبار</h2>
          <div className="space-y-4">
            {sidebarPosts.map((sp) => (
              <div
                key={sp.id}
                className="flex items-start gap-3 rounded-lg bg-gray-200/60 p-2 "
              >
                <div className="relative w-24 h-16 flex-shrink-0 bg-gray-300  overflow-hidden bg-[url(/blace-holder.jpg)] bg-no-repeat bg-cover bg-center">
                  {sp.imageUrl && (
                    <Link href={`/${sp.id}/${sp.slug}`}>
                      <Image
                        src={sp.imageUrl}
                        alt={he.decode(sp.title?.rendered || "")}
                        fill
                        className="object-cover rounded-lg"
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
