"use client";

import { useEffect } from "react";
import "@/app/globals.css";
import "./styles.css";

export default function AccountLayout({ children }) {
  useEffect(() => {
    // original styles
    const originalMargin = document.body.style.margin;
    const originalPadding = document.body.style.padding;
    const originalOverflow = document.body.style.overflow;
    
    // apply account page styles
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    
    // function to restore original styles when navigating away
    return () => {
      document.body.style.margin = originalMargin;
      document.body.style.padding = originalPadding;
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="account-page">
      {children}
    </div>
  );
} 