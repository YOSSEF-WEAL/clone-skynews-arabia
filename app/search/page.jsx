import { Suspense } from "react";
import SearchBox from "../_components/SearchBox";
import SearchResultsList from "../_components/SearchResultsList";
import ListSkeleton from "../_components/ListSkeleton";

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams?.q || "";

  const title = searchQuery
    ? `نتائج البحث عن "${searchQuery}" | الأخبار`
    : "البحث | الأخبار";
  const description = searchQuery
    ? `نتائج البحث عن ${searchQuery} - آخر الأخبار والمستجدات`
    : "ابحث عن آخر الأخبار والمستجدات";
  const logoPath = "/header_logo_color.svg";
  const canonicalPath = searchQuery
    ? `/search?q=${encodeURIComponent(searchQuery)}`
    : "/search";

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

export default async function SearchPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams?.q || "";
  const currentPage = parseInt(resolvedSearchParams?.page || "1");

  return (
    <main className="container mx-auto py-6">
      <Suspense
        fallback={
          <div className="w-full px-4 py-6 text-center">جاري التحميل...</div>
        }
      >
        <SearchBox />
      </Suspense>
      <Suspense
        key={`${searchQuery}-${currentPage}`}
        fallback={<ListSkeleton />}
      >
        <SearchResultsList
          searchQuery={searchQuery}
          currentPage={currentPage}
        />
      </Suspense>
    </main>
  );
}
