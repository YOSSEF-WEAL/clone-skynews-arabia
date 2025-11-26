import { useId } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import apiMenu from "../_apis/apiMenu";
import Navigation from "./Navigation";

async function Header() {
  const id = useId();
  const menuItems = await apiMenu(75); // Menu ID 75

  return (
    <>
      <div className="h-[180px]" />
      <header className="px-3 md:px-10 py-5 fixed z-50 top-0 left-0 w-full  flex items-center justify-center bg-[url(/header_bg_v2.jpg)] bg-center bg-cover">
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3 w-full ">
            <Link href={"/"}>
              <img
                className="w-[200px] md:w-2xs"
                src="/header_logo_color.svg"
                alt="Logo"
              />
            </Link>
            <div className="*:not-first:mt-2">
              <div className="relative bg-white rounded-md ">
                <Input
                  id={id}
                  className="peer ps-9"
                  placeholder="البحث في محتوي سكاي نيوز العربيه"
                  type="search"
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50 ">
                  <Search size={16} aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
          <Navigation menuItems={menuItems} />
        </div>
      </header>
    </>
  );
}

export default Header;
