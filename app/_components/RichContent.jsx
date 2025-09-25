"use client";

import Link from "next/link";
import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

export default function RichContent({ content }) {
  return (
    <div className="prose max-w-none prose-p:leading-8 prose-ul:list-disc prose-ol:list-decimal rich">
      <BlocksRenderer
        content={content}
        blocks={{
          paragraph: ({ children }) => <p>{children}</p>,
          heading: ({ children, level }) => {
            const Tag = `h${level}`;
            const sizeClass =
              level === 1
                ? "text-3xl md:text-4xl"
                : level === 2
                ? "text-2xl md:text-3xl"
                : level === 3
                ? "text-xl md:text-2xl"
                : level === 4
                ? "text-lg md:text-xl"
                : level === 5
                ? "text-base"
                : "text-sm";
            return (
              <Tag className={`mt-6 mb-3 font-bold ${sizeClass}`}>
                {children}
              </Tag>
            );
          },
          list: ({ children, format }) => {
            const Tag = format === "ordered" ? "ol" : "ul";
            const listClass =
              format === "ordered" ? "list-decimal pr-6" : "list-disc pr-6";
            return <Tag className={`my-4 ${listClass}`}>{children}</Tag>;
          },
          quote: ({ children }) => (
            <blockquote className="border-r-4 pr-4 my-4 text-gray-700">
              {children}
            </blockquote>
          ),
          code: ({ plainText }) => (
            <pre className="bg-gray-100 p-3 rounded overflow-auto">
              <code>{plainText}</code>
            </pre>
          ),
          image: ({ image }) => {
            const fallbackSrc = (() => {
              if (!image?.url) return "";
              // Try stripping WP size suffix e.g. -300x200
              return image.url.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, "");
            })();
            const handleError = (e) => {
              if (fallbackSrc && e?.currentTarget?.src !== fallbackSrc) {
                e.currentTarget.src = fallbackSrc;
              }
            };
            return (
              <div className="my-4">
                <img
                  src={image.url}
                  alt={image.alternativeText || ""}
                  width={image.width || 800}
                  height={image.height || 450}
                  className={`w-full h-auto rounded ${image.className || ""}`}
                  loading="lazy"
                  sizes={image.sizes || undefined}
                  srcSet={image.srcSet || undefined}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={handleError}
                />
              </div>
            );
          },
          link: ({ children, url }) => (
            <Link
              href={url}
              className="text-primary underline hover:opacity-80 break-words"
              target={url?.startsWith("http") ? "_blank" : undefined}
              rel={url?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </Link>
          ),
        }}
      />
    </div>
  );
}
