import CartCheckoutButtonClient from './client'
import { ListProduct } from '@/types'

export default function CartCheckoutButton({ product }: { product: ListProduct }) {
  return <CartCheckoutButtonClient product={product} />
}
