import CartLink from '../cart-link'
import type { Lang } from '@/types'
import LogoLink from '../logo-link'

export default function Nav({ lang }: { lang: Lang }) {
  return (
    <nav className="sticky top-0 z-50 flex justify-between bg-black p-4">
      <LogoLink />
      <CartLink lang={lang} />
    </nav>
  )
}
