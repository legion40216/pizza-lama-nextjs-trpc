import React from 'react'
import { CategorySection } from '../sections/category-section'

export type categorySlugProps = { categorySlug: string }

export default function CategoryView({
  categorySlug
}: categorySlugProps) {
  return (
    <CategorySection categorySlug={categorySlug}/>
  )
}
