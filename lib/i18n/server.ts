import 'server-only'
import type { Lang } from '@/types'

export const translations = {
  addToCart: {
    en: 'Add to Cart',
    es: 'Añadir a la Cesta',
  },
  cart: {
    en: 'cart',
    es: 'carrito',
  },
  cartEmpty: {
    en: 'Your cart is empty',
    es: 'Tu carrito está vacío',
  },
  chooseProductColor: {
    en: 'Choose a Color',
    es: 'Elige un color',
  },
  chooseProductSize: {
    en: 'Choose a Size',
    es: 'Elija una talla',
  },
  colors: {
    beige: {
      en: 'beige',
      es: 'beige',
    },
    black: {
      en: 'black',
      es: 'negro',
    },
    blue: {
      en: 'blue',
      es: 'azul',
    },
    brown: {
      en: 'brown',
      es: 'marrón',
    },
    gray: {
      en: 'gray',
      es: 'gris',
    },
    green: {
      en: 'green',
      es: 'verde',
    },
    orange: {
      en: 'orange',
      es: 'naranja',
    },
    pink: {
      en: 'pink',
      es: 'rosa',
    },
    purple: {
      en: 'purple',
      es: 'púrpura',
    },
    red: {
      en: 'red',
      es: 'rojo',
    },
    white: {
      en: 'white',
      es: 'blanco',
    },
    yellow: {
      en: 'yellow',
      es: 'amarillo',
    },
  },
  customersAlsoLiked: {
    en: 'Customers Also Liked',
    es: 'A las clientes también les gustó',
  },
  demographics: {
    men: {
      en: 'men',
      es: 'hombre',
    },
    women: {
      en: 'women',
      es: 'mujer',
    },
    unisex: {
      en: 'unisex',
      es: 'unisex',
    },
    youth: {
      en: 'youth',
      es: 'juvenil',
    },
  },
  footerPoweredBy: {
    en: 'Built with ♥ by Dan and v0. Powered by Next.js and Vercel.',
    es: 'Construido con ♥ por Dan y v0. Desarrollado con Next.js y Vercel.',
  },
  leaveReview: {
    en: 'Leave a Review',
    es: 'Dejar una Reseña',
  },
  noReviewsYet: {
    en: 'This product has not been reviewed yet',
    es: 'Este producto aún no ha sido reseñado',
  },
  sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
  types: {
    hoodie: {
      en: 'hoodie',
      es: 'sudadera con capucha',
    },
    jacket: {
      en: 'jacket',
      es: 'chaqueta',
    },
    parka: {
      en: 'parka',
      es: 'parka',
    },
    sweatshirt: {
      en: 'sweatshirt',
      es: 'sudadera',
    },
    tee: {
      en: 'tee',
      es: 'camiseta',
    },
  },
}

/**
 * Gets a translation value from the translations object using dot notation
 * @param options Object containing lang and key
 * @param options.lang The language to use for the translation
 * @param options.key Dot notation path to the translation (e.g. "colors.red")
 * @returns The translation value or undefined if not found
 */
export function getTranslation({ lang, key }: { lang: Lang; key: string }): string | undefined {
  // Split the key by dots to navigate the nested object
  const keys = key.split('.')

  // Start with the translations object
  let result: any = translations

  // Navigate through the object using the keys
  for (const k of keys) {
    // If at any point the result is undefined or not an object, return undefined
    if (result === undefined || typeof result !== 'object') {
      return undefined
    }

    // Move to the next level in the object
    result = result[k]
  }

  // If the result is an object with language-specific values, return the value for the specified language
  if (result && typeof result === 'object' && lang in result) {
    return result[lang]
  }

  // Return the result (which could be undefined if the path doesn't exist)
  return result
}
