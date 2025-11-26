"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation({ menuItems }) {
  const extractPath = (url, object, objectId) => {
    try {
      const urlObj = new URL(url);
      let pathname = urlObj.pathname;

      // Convert WordPress category URLs to Next.js format
      // From: /category/slug/ or /category/%encoded%/
      // To: /categories/slug
      if (object === "category" || pathname.includes("/category/")) {
        // Extract slug from pathname
        const match = pathname.match(/\/category\/([^\/]+)\/?$/);
        if (match) {
          const slug = decodeURIComponent(match[1]);
          return `/categories/${slug}`;
        }
        // Fallback: use objectId if slug extraction fails
        return `/categories/${objectId}`;
      }

      // For pages, extract the slug
      if (object === "page") {
        const segments = pathname.split("/").filter(Boolean);
        const slug = segments[segments.length - 1];
        return `/${decodeURIComponent(slug)}`;
      }

      // For custom links or other types, return pathname as-is
      return pathname;
    } catch {
      // If URL parsing fails, try to extract from string
      if (typeof url === "string" && url.includes("/category/")) {
        const match = url.match(/\/category\/([^\/]+)\/?$/);
        if (match) {
          const slug = decodeURIComponent(match[1]);
          return `/categories/${slug}`;
        }
      }
      return url;
    }
  };

  return (
    <nav className="w-full bg-white p-2 mt-2 rounded-lg flex flex-row overflow-x-auto gap-3 h-auto min-h-15 items-center">
      {menuItems?.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const itemPath = extractPath(item.url, item.object, item.objectId);

        if (hasChildren) {
          return (
            <DropdownMenu key={item.id}>
              <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 text-nowrap text-base font-semibold transition-all hover:text-primary outline-none focus:outline-none  hover:text-primary cursor-pointer">
                {item.title}
                <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-[200px]  bg-white rounded-lg"
              >
                {item.children.map((child) => (
                  <DropdownMenuItem
                    key={child.id}
                    asChild
                    className="w-full cursor-pointer text-base flex items-center justify-end hover:text-primary"
                  >
                    <Link
                      href={extractPath(
                        child.url,
                        child.object,
                        child.objectId
                      )}
                      className="w-full text-start hover:text-primary"
                      title={child.description}
                    >
                      {child.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <Link
            key={item.id}
            href={itemPath}
            className="px-3 py-2 text-nowrap text-base font-semibold transition-all hover:border-b-3 border-primary"
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
