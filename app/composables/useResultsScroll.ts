import type { Ref } from 'vue'

export function useResultsScroll(
  page: Ref<number>,
  status: Ref<string>,
  target: Ref<HTMLElement | null>,
) {
  let pendingScroll = false
  watch(
    [page, status],
    async ([currentPage, currentStatus], [previousPage]) => {
      if (currentPage !== previousPage) pendingScroll = true
      if (!pendingScroll || currentStatus === 'pending') return
      pendingScroll = false
      await nextTick()
      target.value?.scrollIntoView({ block: 'start' })
    },
    { flush: 'post' },
  )
}
