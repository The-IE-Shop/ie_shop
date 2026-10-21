"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import whiteLogo from "~/public/images/white-ie-logo.png";
import splashImage from "~/public/images/splash-image.png";

export default function Home() {
  const [isSplashActive, setIsSplashActive] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [mountButtons, setMountButtons] = useState(false);

  useEffect(() => {
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 2000);

    const splashTimer = setTimeout(() => {
      setIsSplashActive(false);
    }, 3000);

    const buttonTimer = setTimeout(() => {
      setMountButtons(true);
    }, 3400);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(splashTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <main className={`main-hero-content ${isSplashActive ? "splash-mode" : "hero-mode" } ${showContent ? "content-visible" : ""}`}>
      <section id="hero" aria-label="Welcome Splash">
        <div id="hero-content-container">
          <div id="hero-logo-container">
            <Image
              src={whiteLogo}
              alt="The IE Shop Brand Logo"
              id="hero-logo"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="eager"
            />
          </div>
          <p id="hero-headline">
            The Official Mark
            of the
            Inland Empire
          </p>
        </div>
        <div className="bottom-container">
          <div className="splash-image-container" aria-hidden="true">
            <Image 
              src={splashImage}
              alt=""
              priority
              className="splash-image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {mountButtons && (
            <nav className="home-buttons" aria-label="Main Entry Menu">
              <Link 
                href={`/shop`}
                id="shop-btn" 
                className="link-btn"
              >
                Shop
              </Link>
              <Link 
                href={`/contact`}
                id="contact-btn" 
                className="link-btn"
              >
                Contact
              </Link>
              <Link 
                id="social-media-btn"
                href={`https://www.instagram.com/theie.shop`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="link-btn"
                aria-label="Visit our Instagram page (opens in a new tab)"
                >
                  Instagram
              </Link>
            </nav>
          )}
        </div>
      </section>
    </main>
  );
}
