"use client";

import { usePathname } from "next/navigation";
import { Facebook, Share2, Twitter, MessageCircle } from "lucide-react";
import { toast } from "sonner";

function ShareButtons({ title }) {
  const pathname = usePathname();
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const handleShare = (e, href) => {
    e.preventDefault();
    const width = 550;
    const height = 400;
    const left = (window.innerWidth - width) / 2 + window.screenX;
    const top = (window.innerHeight - height) / 2 + window.screenY;

    window.open(
      href,
      "_blank",
      `width=${width},height=${height},left=${left},top=${top},popup=yes`
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("تم نسخ الرابط بنجاح");
    } catch (err) {
      toast.error("حدث خطأ أثناء نسخ الرابط");
    }
  };

  const shareLinks = [
    {
      name: "facebook",
      icon: <Facebook size={18} />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      color: "bg-[#3b5998] hover:bg-[#3b5998]/80",
    },
    {
      name: "twitter",
      icon: <Twitter size={18} />,
      href: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      color: "bg-[#00acee] hover:bg-[#00acee]/80",
    },
    {
      name: "whatsapp",
      icon: <MessageCircle size={18} />,
      href: `https://api.whatsapp.com/send?text=${title} ${url}`,
      color: "bg-[#25D366] hover:bg-[#25D366]/80",
    },
    {
      name: "copy",
      icon: <Share2 size={18} />,
      onClick: handleNativeShare,
      color: "bg-gray-600 hover:bg-gray-600/80",
    },
  ];

  return (
    <div className="flex gap-2 items-center">
      {shareLinks.map((link) => (
        <button
          key={link.name}
          onClick={link.onClick || ((e) => handleShare(e, link.href))}
          type="button"
          className={`p-2 rounded-full text-white transition-colors ${link.color} cursor-pointer`}
        >
          {link.icon}
        </button>
      ))}
    </div>
  );
}

export default ShareButtons;
