export function paginationItems(current: number, total: number, siblings = 2): (number | string)[] {
  if (total < 1) return []
  const pages = new Set([1, total])
  const start = Math.max(1, Math.min(current - siblings, total - siblings * 2))
  const end = Math.min(total, Math.max(current + siblings, 1 + siblings * 2))
  for (let page = start; page <= end; page++) pages.add(page)
  const sorted = [...pages].sort((a, b) => a - b)
  const items: (number | string)[] = []
  for (const page of sorted) {
    const previous = items.at(-1)
    if (typeof previous === 'number' && page - previous === 2) items.push(previous + 1)
    else if (typeof previous === 'number' && page - previous > 2) items.push(`gap-${previous}`)
    items.push(page)
  }
  return items
}
