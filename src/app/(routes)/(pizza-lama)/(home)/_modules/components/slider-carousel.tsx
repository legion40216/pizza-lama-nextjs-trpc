"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/client-auth-utils";

export function SliderCarousel() {
  const sliders = [
    { img: "/images/slide1.png" },
    { img: "/images/slide2.png" },
    { img: "/images/slide3.jpg" },
  ];

  const [carouselAPI, setCarouselAPI] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const autoplay = useRef(Autoplay({ delay: 2500, stopOnInteraction: false }));

  const onSelect = useCallback(() => {
    if (!carouselAPI) return;
    setSelectedIndex(carouselAPI.selectedScrollSnap());
  }, [carouselAPI]);

  const scrollTo = (index: number) => {
    if (!carouselAPI) return;
    carouselAPI.scrollTo(index);
  };

  useEffect(() => {
    if (!carouselAPI) return;

    onSelect();
    setScrollSnaps(carouselAPI.scrollSnapList());
    carouselAPI.on("select", onSelect);
  }, [carouselAPI, onSelect]);

  return (
    <div className="h-full">
      <Carousel
        plugins={[autoplay.current]}
        opts={{ loop: true, align: "center" }}
        setApi={setCarouselAPI}
        className="h-full"
      >
        <CarouselContent className="h-full">
          {sliders.map((item, index) => (
            <CarouselItem
              key={index}
              className="flex justify-center h-full "
              onMouseEnter={() => autoplay.current.stop()}
              onMouseLeave={() => autoplay.current.play()}
            >
              <div className="relative w-full aspect-square">
                <Image
                  src={item.img}
                  alt="slider"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <>
          <CarouselPrevious className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2" />
          <CarouselNext className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2" />
        </>
      </Carousel>
      <div className="flex justify-center mt-4 space-x-2">
        {scrollSnaps.map((_, index) => (
          <Button
            key={index}
            onClick={() => scrollTo(index)}
            size="icon"
            className={`w-2 h-2 rounded-full ${
              selectedIndex === index ? "bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}