"use client";
import { useEffect, useState, JSX, useRef } from "react";
import { bannerImages, bannerImagesDesktop } from "@/data/banner-images";
import Image from "next/image";


export default function BannerCarousel({ autoSlide = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const isMoving = useRef<boolean>(false);
  
  // Array of cloned banner images
  const extendSlides = [
    bannerImages[bannerImages.length - 1],
    ...bannerImages,
    bannerImages[0]
  ]

  function handleTransitionEnd() {
    isMoving.current = false;

    if(currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(bannerImages.length);
    } else if(currentIndex === extendSlides.length - 1){
      setIsTransitioning(false);
      setCurrentIndex(1);
    }
  }
  
  // Turn tranisition back on
  useEffect(() => {
    if(!isTransitioning) {
      const carouselTimeout = setTimeout(() => {
        setIsTransitioning(true);
      }, 20);
      return () => clearTimeout(carouselTimeout);
    }
  }, [isTransitioning])

  // Slider functions
  function prevSlide() {
    if (isMoving.current) return;
    isMoving.current = true;
    setCurrentIndex((prevIndex) => prevIndex - 1)
  }

  function nextSlide() {
    if (isMoving.current) return;
    isMoving.current = true;
    setCurrentIndex((prevIndex) => prevIndex + 1)
  }

  
  // Auto slide function
  useEffect(() => {
    if (isPaused) return;

    const carouselInterval = setInterval(() => {
      nextSlide()
    }, autoSlide);

    return () => clearInterval(carouselInterval)
  }, [autoSlide, isPaused])

  // Model images
  const bannerImgs = extendSlides.map((image, index) => {
    
    const isClone = index === 0 || index === extendSlides.length - 1;

    return(
      <div 
        className="images-container" 
        key={index}
        aria-hidden={isClone ? "true" : undefined}
      >
        <Image
          src={image.src}
          alt={isClone ? "" : image.alt}
          id={`banner-image-${image.id}`}
          className="banner-image"
          placeholder="blur"
          fill
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    )
  });

  // Desktop view images
  const desktopBannerImgs = bannerImagesDesktop.map((image) => {
    return (
      <div className="images-container" key={image.id}>
        <Image
          src={image.src}
          alt={image.alt}
          className="banner-image"
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    )
  });

  return(
    <section
      className="carousel-wrapper"
      aria-label="Promotional Banners"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div 
        className="carousel-track mobile-view-banner"
        onTransitionEnd={handleTransitionEnd}
        style={{ 
          transform: `translateX(-${currentIndex * 100}%)`, 
          transition: isTransitioning ? "transform 0.5s ease-in-out" : "none"
        }}
      >
        {bannerImgs}
      </div>

      <div className="banner-static desktop-view-banner">
        {desktopBannerImgs}
      </div>
    </section>
  )
}