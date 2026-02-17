"use client";

import React from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/user";
import { useUserRole } from "@/hooks/useUserRole";
import { useProfileDetail } from "@/hooks/useProfileDetail";

export default function Header() {
  const pathName = usePathname();
  const isAuthPage = pathName.includes("signin") || pathName.includes("signup");
  const { user } = useUserStore();
  const { role: userRole } = useUserRole();
  const { profile } = useProfileDetail();

  if (isAuthPage) return null;
  return (
    <div
      className="flex items-center justify-between mb-6 px-6 fixed top-0 w-[calc(100%-80px)] left-20 bg-background/70  z-50 py-4"
      style={{ backdropFilter: "blur(20px)" }}
    >
      <div className="flex items-center space-x-4"></div>
      <div className="flex gap-10 items-center">
        {/* Profile Avatar with Name */}
        <Link href="/settings" className="cursor-pointer flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Avatar className="size-10 border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <AvatarImage
              src={profile?.image || profile?.image_url}
              alt={`${profile?.first_name || ""} ${profile?.last_name || ""}`}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {profile?.first_name?.charAt(0)?.toUpperCase() || ""}
              {profile?.last_name?.charAt(0)?.toUpperCase() || ""}
              {!profile?.first_name && !profile?.last_name && user?.email?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {profile?.first_name && profile?.last_name
                ? `${profile.first_name} ${profile.last_name}`
                : profile?.first_name
                  ? profile.first_name
                  : user?.email?.split("@")[0] || "User"}
            </span>
            <span className="text-xs text-muted-foreground">
              {userRole === "dealer"
                ? "System Admin"
                : userRole === "hr"
                  ? "HR"
                  : userRole === "accountant"
                    ? "Accountant"
                    : userRole === "seller"
                      ? "Seller"
                      : ""}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
