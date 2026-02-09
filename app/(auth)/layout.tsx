import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="h-screen w-screen grid place-items-center fixed top-0 left-0"
    >
      {children}
    </div>
  );
}
