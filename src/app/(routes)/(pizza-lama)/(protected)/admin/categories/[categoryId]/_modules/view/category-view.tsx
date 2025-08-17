import React from 'react'

import HeadingState from '@/components/global-ui/heading-state'
import { Separator } from '@/components/ui/separator'
import { CategorySection } from '../section/category-section'

export type categoryIdProps = {
  categoryId: string
}

export default function CategoryView({
  categoryId
}: categoryIdProps) {
  return (
    <div className='space-y-5'>
      <HeadingState 
      title="Category form" 
      subtitle="Update category for your application" 
      /> 

      <Separator />

      <CategorySection categoryId={categoryId} />
    </div>
  )
}
