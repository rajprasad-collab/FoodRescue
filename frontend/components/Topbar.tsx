"use client";

import { usePathname } from "next/navigation";

const pageNames: Record<string, string> = {
  "/": "Overview",
  "/donations": "Donations",
  "/routes": "Routes",
  "/partners": "Partners",
  "/performance": "Performance",
  "/algorithms": "Algorithm Engine",
  "/ai-assistant": "AI Assistant",
  "/settings": "Settings",
};

export default function Topbar() {
  const pathname = usePathname();

  const pageName =
    pageNames[pathname] ||
    Object.entries(pageNames).find(
      ([path]) => path !== "/" && pathname.startsWith(path)
    )?.[1] ||
    "FoodRescue";

  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-20 border-b border-[#e7e5df] bg-[#fbfaf7]/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-8">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#92958f]">
            FoodRescue Operations
          </div>

          <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#26352f]">
            {pageName}
          </h1>
        </div>

        <div className="flex items-center gap-5">
          {/* API status */}
          <div className="hidden items-center gap-2 md:flex">
            <span className="h-2 w-2 rounded-full bg-[#4d9b72]" />

            <span className="text-xs text-[#687069]">
              Algorithm engine online
            </span>
          </div>

          <div className="h-6 w-px bg-[#e4e2dc]" />

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-[#34413a]">
                Operations Admin
              </div>

              <div className="text-[11px] text-[#92958f]">
                FoodRescue Network
              </div>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dce9e3] text-sm font-semibold text-[#285547]">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}