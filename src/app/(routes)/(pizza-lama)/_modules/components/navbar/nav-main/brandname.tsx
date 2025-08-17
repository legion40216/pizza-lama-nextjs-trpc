import Link from 'next/link'
import React from 'react'

export default function Brandname() {
  return (
    <Link href="/" className="block">
        <h1 className='text-2xl font-bold 
        text-[var(--pizza_store-primary)]'>
          Brandname
        </h1>
    </Link>
  )
}
