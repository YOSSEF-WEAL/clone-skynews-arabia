import Image from "next/image";
import Link from "next/link";
import apiSearchPosts from "../_apis/apiSearchPosts";
import ListNews from "./ListNews";

export default async function SearchResultsList({ searchQuery, currentPage }) {
  // Fetch posts with pagination from API
  const postsPerPage = 20;
  const { posts: postsArray, pagination } = await apiSearchPosts(
    searchQuery,
    currentPage,
    postsPerPage
  );

  // Use pagination data from API
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;

  // If no search query provided
  if (!searchQuery || searchQuery.trim() === "") {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-xl text-gray-600">
          الرجاء إدخال كلمة البحث في الأعلى
        </p>
      </div>
    );
  }

  // If no results found
  if (postsArray.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-xl text-gray-600">
          لا توجد نتائج للبحث عن &quot;{searchQuery}&quot;
        </p>
        <p className="text-gray-500 mt-2">جرب كلمات بحث أخرى</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="px-4 mb-4">
        <p className="text-gray-600">
          نتائج البحث عن &quot;{searchQuery}&quot; - {totalItems} نتيجة
        </p>
      </div>

      <ListNews posts={postsArray} categoriePage="نتائج البحث" />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-center gap-4 my-8 px-4">
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            {currentPage > 1 && (
              <Link
                href={`/search?q=${encodeURIComponent(searchQuery)}${
                  currentPage - 1 > 1 ? `&page=${currentPage - 1}` : ""
                }`}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                السابق
              </Link>
            )}

            {/* Page Numbers */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

                  if (!showPage) {
                    // Show ellipsis
                    if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <span key={pageNum} className="px-3 py-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <Link
                      key={pageNum}
                      href={`/search?q=${encodeURIComponent(searchQuery)}${
                        pageNum === 1 ? "" : `&page=${pageNum}`
                      }`}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        pageNum === currentPage
                          ? "bg-primary text-white"
                          : "bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                }
              )}
            </div>

            {/* Next Button */}
            {currentPage < totalPages && (
              <Link
                href={`/search?q=${encodeURIComponent(searchQuery)}&page=${
                  currentPage + 1
                }`}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                التالي
              </Link>
            )}
          </div>

          {/* Page Info */}
          <p className="text-gray-600 text-sm">
            الصفحة {currentPage} من {totalPages} - إجمالي {totalItems} مقال
          </p>
        </div>
      )}
    </div>
  );
}
