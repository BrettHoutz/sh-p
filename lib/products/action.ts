'use server'
import { getRandomItem } from '../util'
import { setProductPrice } from '../edge-config/server'
import { sleep } from '../util'
import { unstable_expireTag } from 'next/cache'

export async function refreshProduct({ slug }: { slug: string }) {
  // Generate random price from specified values
  const possiblePrices = [40, 60, 80, 100, 120, 140, 160]
  const price = getRandomItem(possiblePrices) || 100

  // 10% chance of having a compareAtPrice (price + 20)
  const hasCompareAtPrice = Math.random() < 0.1
  const compareAtPrice = hasCompareAtPrice ? price + 20 : undefined

  await setProductPrice({ compareAtPrice, price, slug })

  if (process.env.EDGE_CONFIG) {
    await sleep(4000)
  }

  await unstable_expireTag(`product-${slug}`)
}
