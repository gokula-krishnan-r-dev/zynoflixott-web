"use client";
import React, { useEffect } from "react";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Disable text selection
    document.body.style.userSelect = "none";

    // Disable right-click context menu
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);

    // Prevent copy operations
    const preventCopy = (event: ClipboardEvent | KeyboardEvent) => {
      if (
        event.type === "keydown" &&
        ((event as KeyboardEvent).ctrlKey && (event as KeyboardEvent).key === "c") ||
        ((event as KeyboardEvent).metaKey && (event as KeyboardEvent).key === "c")
      ) {
        event.preventDefault();
      }
      if (event.type === "copy") {
        event.preventDefault();
      }
    };

    document.addEventListener("copy", preventCopy as EventListener);
    document.addEventListener("keydown", preventCopy as EventListener);

    return () => {
      // Clean up event listeners and CSS rule
      document.body.style.userSelect = "";
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", preventCopy as EventListener);
      document.removeEventListener("keydown", preventCopy as EventListener);
    };
  }, []);

  return <>{children}</>;
} 