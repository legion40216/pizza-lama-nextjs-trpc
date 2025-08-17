import { Button } from '@/components/ui/button'
import React from 'react'
import { SliderCarousel } from '../components/slider-carousel'
import { FeaturedSection } from '../sections/featured-section'

export default function HomeView() {
  return (
    <div className="space-y-10">
      {/* HERO SECTION */}
      <div className="grid md:grid-cols-2 gap-4 h-full">
        {/* TEXT CONTENT */}
        <div className="flex flex-col justify-center space-y-2">
          <div>
            <h1 className="text-3xl font-bold">
              Your Title
            </h1>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>

          <Button
            className="bg-pizza-store-primary text-white 
          hover:bg-pizza-store-primary/90"
          >
            Order Now
          </Button>
        </div>

        {/* SLIDER CONTENT */}
        <div className="h-full">
          <SliderCarousel />
        </div>
      </div>
      
      {/* FEATURED PRODUCTS */}
      <div>
        <h1 className="text-3xl font-bold">Featured Products</h1>
        <FeaturedSection />
      </div>
    </div>
  )
}
