import Image from "next/image";
import apiGetCategorie from "../../_apis/apiGetCategorie";
import apiPostesCategorie from "../../_apis/apiPostesCategorie";
import CategorieHero from "../../_components/CategorieHero";
import ListNews from "../../_components/ListNews";

export async function generateMetadata({ params }) {
  const { categorie } = await params;
  let allCategorie = null;
  try {
    allCategorie = await apiGetCategorie(categorie);
  } catch (_) {}

  const name = allCategorie?.name || "";
  const description = allCategorie?.description?.trim()
    ? allCategorie.description
    : name
    ? `آخر الأخبار من قسم ${name}`
    : "آخر الأخبار والمستجدات";

  const title = name ? `${name} | الأخبار` : "الأخبار";
  const logoPath = "/header_logo_color.svg";
  const canonicalPath = `/categories/${categorie}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: "A3raff News",
      locale: "ar_EG",
      type: "website",
      images: [logoPath],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [logoPath],
    },
  };
}

export default async function Page({ params }) {
  const { categorie } = await params;
  // Fetch category first to resolve ID, then fetch posts by ID for reliability
  const allCategorie = await apiGetCategorie(categorie);
  const categorieId = allCategorie?.id ?? categorie; // fallback to slug if id missing
  const posts = await apiPostesCategorie(categorieId);
  const renderName = allCategorie?.name;

  // Ensure posts is an array before using slice
  const postsArray = Array.isArray(posts) ? posts : [];
  const firstPosts = postsArray.slice(0, 4);
  const after4Posts = postsArray.slice(4);

  return (
    <div className="">
      <CategorieHero posts={firstPosts} categoriePage={renderName} />
      {/* ads */}
      <div className="my-4 space-y-2">
        <div className="relative w-full h-20">
          <Image
            src="/test-ads.jpg"
            className="object-contain"
            alt="ads"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
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
      </div>
      {/* ads */}
      <ListNews posts={after4Posts} categoriePage={renderName} />
    </div>
  );
}
