/**
 * Measures the absolute alphabetical distance between the first characters of two strings
 * Useful for sorting algorithms or measuring string similarity
 * @param a The first string to compare
 * @param b The second string to compare
 * @returns Object containing the absolute difference in character codes, or 0 if either string is empty
 */
export function alphabeticalDistance({ a, b }: { a: string; b: string }): { distance: number } {
  // Handle empty strings by returning zero distance
  if (a.length === 0 || b.length === 0) {
    return { distance: 0 }
  }

  // Convert to lowercase for case-insensitive comparison
  const char1 = a.charAt(0).toLowerCase()
  const char2 = b.charAt(0).toLowerCase()

  // Calculate absolute difference between character codes
  const distance = Math.abs(char1.charCodeAt(0) - char2.charCodeAt(0))

  return { distance }
}

/**
 * Selects a random item from an array
 * @param arr The array to select from
 * @returns A random item from the array, or undefined if the array is empty
 */
export function getRandomItem<T>(arr: T[]): T | undefined {
  // Return undefined for empty arrays
  if (arr.length === 0) {
    return undefined
  }

  // Generate random index and return the item at that position
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}

/**
 * Generates a random number within a specified range (inclusive)
 * @param min The minimum value (inclusive)
 * @param max The maximum value (inclusive)
 * @returns A random integer between min and max (inclusive)
 */
export function randomInRange({ min, max }: { min: number; max: number }): number {
  // Ensure min is not greater than max
  if (min > max) {
    throw new Error('Minimum value cannot be greater than maximum value')
  }

  // Generate random number in range [min, max] inclusive
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Shuffles an array using the Fisher-Yates algorithm
 * Creates a new array without mutating the original
 * @param array The array to shuffle
 * @returns Object containing a new array with the same elements in random order
 */
export function shuffle<T>({ array }: { array: T[] }): { result: T[] } {
  // Create a copy of the array to avoid mutating the original
  const result = [...array]

  // Fisher-Yates shuffle algorithm - iterate backwards through the array
  for (let i = result.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i (inclusive)
    const j = Math.floor(Math.random() * (i + 1))

    // Swap elements at indices i and j using destructuring assignment
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return { result }
}

/**
 * Creates a promise that resolves after a specified delay
 * Useful for adding delays in async functions or testing
 * @param ms The number of milliseconds to wait
 * @returns A promise that resolves after the specified delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Calculates the sum of all numbers in an array
 * @param arr Array of numbers to sum
 * @returns The total sum of all numbers in the array
 */
export function sum(arr: number[]): number {
  return arr.reduce((acc, curr) => acc + curr, 0)
}

/**
 * Converts a string to title case (first letter of each word capitalized)
 * Handles multiple words separated by spaces
 * @param str The string to convert
 * @returns The string converted to title case
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase() // Convert entire string to lowercase first
    .split(' ') // Split into individual words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(' ') // Join words back together with spaces
}
