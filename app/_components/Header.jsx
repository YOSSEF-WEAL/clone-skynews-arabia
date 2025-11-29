import { useId } from "react";
import Link from "next/link";

import apiMenu from "../_apis/apiMenu";
import Navigation from "./Navigation";
import HeaderSearchInput from "./HeaderSearchInput";
import MobileMenu from "./MobileMenu";

async function Header() {
  const id = useId();
  const menuItems = await apiMenu(75); // Menu ID 75

  return (
    <>
      <div className="h-[100px] md:h-[180px]" />
      <header className="px-3 md:px-10 py-5 fixed z-40 top-0 left-0 w-full flex items-center justify-center bg-[url(/header_bg_v2.jpg)] bg-center bg-cover shadow-md">
        <div className="w-full flex flex-col gap-2">
          {/* Top Bar: Logo & Search/Menu */}
          <div className="flex items-center justify-between gap-3 w-full flex-row md:flex-row">
            {/* Logo */}
            <Link href={"/"}>
              <img
                className="w-[150px] md:w-2xs"
                src="/header_logo_color.svg"
                alt="Logo"
              />
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:block *:not-first:mt-2">
              <HeaderSearchInput />
            </div>

            {/* Mobile Menu Trigger (Left side on mobile) */}
            <MobileMenu menuItems={menuItems} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <Navigation menuItems={menuItems} />
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
