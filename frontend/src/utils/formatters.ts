export function formatPrice(p: number) {
  return `₹${p.toLocaleString('en-IN')}`
}
