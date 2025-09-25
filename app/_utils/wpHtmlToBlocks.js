import { parseDocument } from "htmlparser2";

// Convert WordPress HTML (post.content.rendered) into Strapi Blocks-like structure
// Supported: paragraphs, headings (h2/h3), lists, links, images, plain text

function toTextNode(text) {
  return { type: "text", text: text };
}

function toLinkNode(url, children) {
  return { type: "link", url, children };
}

function toParagraph(children) {
  return { type: "paragraph", children };
}

function toHeading(level, children) {
  return {
    type: "heading",
    level,
    children,
    plainText: children.map((c) => (c.type === "text" ? c.text : "")).join(""),
  };
}

function toList(ordered, items) {
  return {
    type: "list",
    format: ordered ? "ordered" : "unordered",
    children: items,
  };
}

function toListItem(children) {
  return { type: "list-item", children };
}

function toImage(src, alt, extra = {}) {
  return {
    type: "image",
    image: {
      url: src,
      alternativeText: alt || "",
      width: extra.width ? Number(extra.width) : undefined,
      height: extra.height ? Number(extra.height) : undefined,
      srcSet: extra.srcset || extra.srcSet,
      sizes: extra.sizes,
      className: extra.class || extra.className,
    },
  };
}

function flattenText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function walkInline(nodes) {
  const out = [];
  for (const node of nodes || []) {
    if (node.type === "text") {
      const t = node.data ?? "";
      if (t.trim()) out.push(toTextNode(t));
    } else if (node.type === "tag") {
      if (node.name === "a") {
        const href = node.attribs?.href || "#";
        const children = walkInline(node.children);
        out.push(
          toLinkNode(href, children.length ? children : [toTextNode(href)])
        );
      } else if (node.name === "br") {
        out.push(toTextNode("\n"));
      } else if (node.name === "strong" || node.name === "b") {
        const children = walkInline(node.children);
        // Represent bold as text nodes for simplicity
        out.push(...children);
      } else if (node.name === "em" || node.name === "i") {
        const children = walkInline(node.children);
        out.push(...children);
      } else if (node.name === "img") {
        // Inline images: return as image block at block level later; here skip
        // Caller will handle block-level images
      } else {
        // Fallback: descend
        out.push(...walkInline(node.children));
      }
    }
  }
  return out;
}

export default function wpHtmlToBlocks(html) {
  if (!html || typeof html !== "string") return [];
  const doc = parseDocument(html);
  const body = doc.children || [];
  const blocks = [];

  function walkBlock(nodes) {
    for (const node of nodes) {
      if (node.type === "text") {
        const t = flattenText(node.data || "");
        if (t) blocks.push(toParagraph([toTextNode(t)]));
      } else if (node.type === "tag") {
        const name = node.name;
        if (name === "p") {
          const children = walkInline(node.children);
          if (children.length) blocks.push(toParagraph(children));
        } else if (
          name === "h1" ||
          name === "h2" ||
          name === "h3" ||
          name === "h4" ||
          name === "h5" ||
          name === "h6"
        ) {
          const level = Number(name.replace("h", "")) || 2;
          const children = walkInline(node.children);
          if (children.length) blocks.push(toHeading(level, children));
        } else if (name === "ul" || name === "ol") {
          const ordered = name === "ol";
          const items = [];
          for (const li of node.children || []) {
            if (li.type === "tag" && li.name === "li") {
              const children = walkInline(li.children);
              if (children.length) items.push(toListItem(children));
            }
          }
          if (items.length) blocks.push(toList(ordered, items));
        } else if (name === "img") {
          const src = node.attribs?.src || "";
          if (src)
            blocks.push(
              toImage(src, node.attribs?.alt, {
                width: node.attribs?.width,
                height: node.attribs?.height,
                srcset: node.attribs?.srcset,
                sizes: node.attribs?.sizes,
                class: node.attribs?.class,
              })
            );
        } else if (name === "figure") {
          // Look for img inside figure
          const img = (node.children || []).find(
            (c) => c.type === "tag" && c.name === "img"
          );
          if (img) {
            const src = img.attribs?.src || "";
            if (src)
              blocks.push(
                toImage(src, img.attribs?.alt, {
                  width: img.attribs?.width,
                  height: img.attribs?.height,
                  srcset: img.attribs?.srcset,
                  sizes: img.attribs?.sizes,
                  class: img.attribs?.class,
                })
              );
          }
        } else if (name === "blockquote") {
          const children = walkInline(node.children);
          if (children.length) blocks.push({ type: "quote", children });
        } else if (name === "pre" || name === "code") {
          const text = flattenText(
            (node.children || [])
              .map((c) => (c.type === "text" ? c.data : ""))
              .join(" ")
          );
          if (text) blocks.push({ type: "code", plainText: text });
        } else {
          // Fallback: try to collect inline content
          const children = walkInline(node.children);
          if (children.length) blocks.push(toParagraph(children));
        }
      }
    }
  }

  walkBlock(body);
  return blocks;
}
