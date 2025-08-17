import React from 'react'
import Client from './_modules/components/client'

export default function Page() {
  return (
    <div className='space-y-4'>
      {/* TITLE SECTION */}
        <div className='space-y-1'>
          <h1 className='font-bold text-2xl'>Checkout Page</h1>
          <p className='text-muted-foreground'>This is the checkout page where you can review your order and proceed to payment.</p>
        </div>
      {/* CHECKOUT SECTION */}
        <Client />
    </div>
  )
}
