import type { VueWrapper } from '@vue/test-utils'
import type { Filter } from './filters/filter-descriptions'
import type { AppliedFilterCollection } from '~/composables/applied-filters'
import type { ImportResult } from '~/composables/data-importer'
import type { Card } from '~/composables/types'
import { shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import * as bookmarkModule from '~/composables/bookmark-storage'
import * as dataImporterModule from '~/composables/data-importer'
import * as printModule from '~/composables/print'
import { traitFilter } from './filters/filter-descriptions'
import FilterManager from './filters/FilterManager.vue'
import ListPage from './ListPage.vue'

vi.spyOn(dataImporterModule, 'dataImporter').mockReturnValue(ref({} as ImportResult))
vi.spyOn(printModule, 'usePrinter').mockReturnValue(() => {})
vi.spyOn(bookmarkModule, 'useBookmarks').mockReturnValue(new bookmarkModule.Bookmarker(ref([] as bookmarkModule.BookmarkList[]), ref(0)))

function makeCard(id: number, overrides: Partial<Card> = {}): Card {
  return { id, name: `Card ${id}`, search_text: `card ${id}`, level: 1, ...overrides } as Card
}

describe('listPage', () => {
  it('shows loading state when no collection is provided', () => {
    const wrapper = shallowMount(ListPage, { props: { pageName: 'creature' } })
    expect(wrapper.text()).toContain('Loading')
    expect(wrapper.findAll('card-stub')).toHaveLength(0)
  })

  it('renders all cards from the collection', () => {
    const wrapper = shallowMount(ListPage, { props: { pageName: 'creature', collection: [makeCard(1), makeCard(2)] } })
    expect(wrapper.findAll('card-stub')).toHaveLength(2)
  })

  it('shows at most 50 cards initially when collection exceeds page size', () => {
    const cards = Array.from({ length: 100 }, (_, i) => makeCard(i))
    const wrapper = shallowMount(ListPage, { props: { pageName: 'creature', collection: cards } })
    expect(wrapper.findAll('card-stub')).toHaveLength(50)
  })

  describe('re-hydration', () => {
    const fireCard = makeCard(1, { trait: ['Fire', 'Evocation'] })
    const coldCard = makeCard(2, { trait: ['Cold'] })
    const cards = [fireCard, coldCard]

    let wrapper: VueWrapper<InstanceType<typeof ListPage>>
    let appliedFilters: AppliedFilterCollection

    beforeEach(() => {
      wrapper = shallowMount(ListPage, { props: { pageName: 'creature', collection: cards } })
      appliedFilters = wrapper.findComponent(FilterManager).props('appliedFilters') as AppliedFilterCollection
      appliedFilters.filters.clear()
    })

    it('changes the filter options based on the filtered card set', async () => {
      appliedFilters.addFilter(traitFilter, 'Fire')
      wrapper.findComponent(FilterManager).vm.$emit('change')
      await nextTick()

      let filterList = wrapper.findComponent(FilterManager).props('filterList') as Filter[]
      let traitOptions = filterList?.find(f => f.key === 'trait')?.options

      expect(traitOptions).toEqual(['Fire', 'Evocation'])

      appliedFilters.removeFilter(traitFilter.key, 'Fire')
      wrapper.findComponent(FilterManager).vm.$emit('change')
      await nextTick()

      filterList = wrapper.findComponent(FilterManager).props('filterList') as Filter[]
      traitOptions = filterList?.find(f => f.key === 'trait')?.options

      expect(traitOptions).toEqual(['Fire', 'Evocation', 'Cold'])
    })

    it('increments rehydrateCount on each filter change', async () => {
      const manager = wrapper.findComponent(FilterManager)
      const initialCount = manager.props('rehydrateCount') as number

      manager.vm.$emit('change')
      await nextTick()

      expect(wrapper.findComponent(FilterManager).props('rehydrateCount')).toBeGreaterThan(initialCount)
    })
  })
})
