import React from 'react'
import { ProductSection } from '../sections/product-section'

export type ProductIdProps = {
  productId: string;
};

export default function ProductView({
  productId
}: ProductIdProps) {
  return (
    <ProductSection productId={productId} />
  )
}
