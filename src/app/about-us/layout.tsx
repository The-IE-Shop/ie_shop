import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutUsLayout({ children }: { children: React.ReactNode}): React.JSX.Element {
  return(
    <div id="product-layout-container">
      <Header />
      <div className="layout-wrapper">
        {children}
      </div>
      <Footer />
    </div>
  )
}