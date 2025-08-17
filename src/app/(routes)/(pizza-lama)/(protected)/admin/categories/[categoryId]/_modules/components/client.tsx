"use client"
import React from 'react'
import CategoryForm from './client/category-form'

export type initialDataProps = {
  id: string
  title: string
  descr: string
  imgSrc: string
  slug: string
}

type ClientProps = {
  initialData: initialDataProps
}

export default function Client({initialData}:ClientProps) {
  return (
    <div>
      <CategoryForm 
        id={initialData.id}
        title={initialData.title}
        descr={initialData.descr}
        imgSrc={initialData.imgSrc}
        slug={initialData.slug}
      />
    </div>
  )
}
