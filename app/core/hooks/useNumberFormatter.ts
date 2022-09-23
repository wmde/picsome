import { useRouter } from "blitz"

export const useNumberFormatter = (): ((number: number) => string) => {
  const router = useRouter()
  try {
    // Try to use i18n number formatter
    const formatter = new window.Intl.NumberFormat(router.locale?.replace("_", "-"))
    return formatter.format
  } catch (error) {
    // Fallback to return number as is
    return (number) => number.toString()
  }
}
