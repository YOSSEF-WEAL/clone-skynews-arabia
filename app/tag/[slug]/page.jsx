import { Suspense } from "react";
import apiGetTag from "../../_apis/apiGetTag";
import ListSkeleton from "../../_components/ListSkeleton";
import TagPostsList from "../../_components/TagPostsList";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let tagData = null;
  try {
    tagData = await apiGetTag(slug);
  } catch (_) {}

  const name = tagData?.name || "";
  const description = tagData?.description?.trim()
    ? tagData.description
    : name
    ? `آخر الأخبار عن ${name}`
    : "آخر الأخبار والمستجدات";

  const title = name ? `${name} | الأخبار` : "الأخبار";
  const logoPath = "/header_logo_color.svg";
  const canonicalPath = `/tag/${slug}`;

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

export default async function Page({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams?.page || "1");

  // Fetch tag first to resolve ID
  const tagData = await apiGetTag(slug);
  const tagId = tagData?.id ?? slug;
  const renderName = tagData?.name;

  return (
    <Suspense key={currentPage} fallback={<ListSkeleton />}>
      <TagPostsList
        tagId={tagId}
        currentPage={currentPage}
        renderName={renderName}
        tagSlug={slug}
      />
    </Suspense>
  );
}
