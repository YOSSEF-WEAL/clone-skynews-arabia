import Image from "next/image";
import Link from "next/link";
import categoriesData from "../_apis/apiCategories";

export const metadata = {
  title: "جميع الأقسام | الأخبار",
  description: "تصفح جميع أقسام الموقع واختر القسم المناسب لك",
};

export default async function CategoriesPage() {
  const categories = await categoriesData();

  return (
    <div className="max-w-full md:max-w-[1350px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">جميع الأقسام</h1>
        <p className="text-gray-600">اختر القسم الذي تريد تصفحه</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories?.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary"
          >
            <div className="p-6 flex flex-col items-center justify-center min-h-[150px]">
              {/* Category Icon/Badge */}
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>

              {/* Category Name */}
              <h2 className="text-lg md:text-xl font-bold text-center group-hover:text-primary transition-colors">
                {category.name}
              </h2>

              {/* Post Count */}
              {category.count > 0 && (
                <span className="mt-2 text-sm text-gray-500">
                  {category.count} مقال
                </span>
              )}

              {/* Description (if available) */}
              {category.description && (
                <p className="mt-2 text-xs text-gray-600 text-center line-clamp-2">
                  {category.description.replace(/<[^>]*>/g, "")}
                </p>
              )}
            </div>

            {/* Hover Arrow */}
            <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
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
                className="text-primary"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {categories?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">لا توجد أقسام متاحة حالياً</p>
        </div>
      )}
    </div>
  );
}
