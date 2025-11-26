import Image from "next/image";
import Link from "next/link";
import apiPostesCategorie from "../_apis/apiPostesCategorie";
import CategorieHero from "./CategorieHero";
import ListNews from "./ListNews";

export default async function CategoryPostsList({ categorieId, currentPage, renderName, categorieSlug }) {
  // Fetch posts with pagination from API
  const postsPerPage = 20;
  const { posts: postsArray, pagination } = await apiPostesCategorie(categorieId, currentPage, postsPerPage);
  
  // Use pagination data from API
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;
  
  // For page 1: show hero with first 4 posts, then remaining posts
  // For page 2+: show all posts without hero
  const isFirstPage = currentPage === 1;
  const firstPosts = isFirstPage ? postsArray.slice(0, 4) : [];
  const listPosts = isFirstPage ? postsArray.slice(4) : postsArray;

  return (
    <div className="">
      {/* Show CategorieHero only on first page */}
      {isFirstPage && <CategorieHero posts={firstPosts} categoriePage={renderName} />}
      
      {/* ads */}
      {isFirstPage && (
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
      )}
      
      
      <ListNews posts={listPosts} categoriePage={renderName} />
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-center gap-4 my-8 px-4">
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            {currentPage > 1 && (
              <Link
                href={`/categories/${categorieSlug}?page=${currentPage - 1}`}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                السابق
              </Link>
            )}
            
            {/* Page Numbers */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                // Show first page, last page, current page, and pages around current
                const showPage =
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                
                if (!showPage) {
                  // Show ellipsis
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
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
                    href={`/categories/${categorieSlug}${pageNum === 1 ? "" : `?page=${pageNum}`}`}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      pageNum === currentPage
                        ? "bg-primary text-white"
                        : "bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>
            
            {/* Next Button */}
            {currentPage < totalPages && (
              <Link
                href={`/categories/${categorieSlug}?page=${currentPage + 1}`}
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
