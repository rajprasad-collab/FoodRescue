"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Overview",
    href: "/",
    icon: "⌂",
  },
  {
    label: "Donations",
    href: "/donations",
    icon: "▣",
  },
  {
    label: "Routes",
    href: "/routes",
    icon: "↗",
  },
  {
    label: "Partners",
    href: "/partners",
    icon: "◎",
  },
  {
    label: "Performance",
    href: "/performance",
    icon: "▥",
  },
  {
    label: "Algorithm Engine",
    href: "/algorithms",
    icon: "◇",
  },
  {
    label: "AI Assistant",
    href: "/ai-assistant",
    icon: "✦",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[#e7e5df] bg-[#f8f7f3]">
      {/* Brand */}
      <div className="flex h-20 items-center border-b border-[#e7e5df] px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#173f35] text-lg font-bold text-white">
            F
          </div>

          <div>
            <div className="text-[16px] font-semibold tracking-tight text-[#173f35]">
              FoodRescue
            </div>
            <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8a8d87]">
              Redistribution Network
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a9c96]">
          Operations
        </div>

        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-[#e3eee9] font-semibold text-[#173f35]"
                    : "text-[#666b65] hover:bg-[#efeee9] hover:text-[#173f35]"
                }`}
              >
                <span
                  className={`flex w-5 justify-center text-base ${
                    isActive
                      ? "text-[#2f6b5b]"
                      : "text-[#8b908a] group-hover:text-[#2f6b5b]"
                  }`}
                >
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* System status */}
      <div className="border-t border-[#e7e5df] p-4">
        <div className="rounded-lg border border-[#dfe5df] bg-white px-3 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#4d9b72]" />
            <span className="text-xs font-semibold text-[#34413a]">
              System operational
            </span>
          </div>

          <p className="mt-1 text-[11px] leading-4 text-[#858a84]">
            Python algorithm engine connected
          </p>
        </div>

        <Link
          href="/settings"
          className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#666b65] hover:bg-[#efeee9] hover:text-[#173f35]"
        >
          <span className="w-5 text-center">⚙</span>
          Settings
        </Link>
      </div>
    </aside>
  );
}