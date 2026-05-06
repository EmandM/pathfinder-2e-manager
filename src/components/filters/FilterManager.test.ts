import { shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { AppliedFilterCollection } from '~/composables/applied-filters'
import { FilterState } from '~/composables/types'
import { hasImageFilter, traitFilter } from './filter-descriptions'
import FilterManager from './FilterManager.vue'
import FilterTag from './FilterTag.vue'
import Select from './Select.vue'

describe('filterManager', () => {
  const traitFilterOptions = ['someTrait', 'anotherTrait']
  const singleOptionFilter = hasImageFilter
  beforeEach(() => {
    traitFilter.options = [...traitFilterOptions]
  })

  let wrapper = shallowMount(FilterManager, {
    props: {
      filterList: [traitFilter, singleOptionFilter],
      levelOptions: [],
      appliedFilters: new AppliedFilterCollection(),
      rehydrateCount: 0,
    },
  })

  it('hydrates existing filters on shallowMount', () => {
    const traitToTest = traitFilterOptions[0]
    const appliedFilters = new AppliedFilterCollection()
    appliedFilters.addFilter(traitFilter, traitToTest)
    appliedFilters.addFilter(singleOptionFilter, '')

    const wrapper = shallowMount(FilterManager, {
      props: {
        filterList: [traitFilter, singleOptionFilter],
        levelOptions: [],
        appliedFilters,
        rehydrateCount: 0,
      },
    })

    // Check that the trait sub-dropdown is rendered
    const traitSubDropdown = wrapper.findAllComponents(Select).find(s => s.props('title') === traitFilter.name)
    expect(traitSubDropdown).toBeDefined()
    const shownOptions = traitSubDropdown?.props('options') as string[]
    expect(shownOptions).not.toContain(traitToTest)
    expect(shownOptions).toContain(traitFilterOptions[1])

    // Check that the trait filter was added as a tag
    const traitTag = wrapper.findAllComponents(FilterTag).find(tag => tag.props('title') === traitFilter.getTag(traitToTest))
    expect(traitTag).toBeDefined()

    // Check that the single-option filter is rendered as a tag
    const imageTag = wrapper.findAllComponents(FilterTag).find(tag => tag.props('title') === singleOptionFilter.getTag(''))
    expect(imageTag).toBeDefined()

    expect(wrapper.emitted('change')).toBeFalsy()

    wrapper.unmount()
  })

  describe('adding filters', () => {
    // let wrapper: VueWrapper
    beforeEach(() => {
      wrapper = shallowMount(FilterManager, {
        props: {
          filterList: [traitFilter, singleOptionFilter],
          levelOptions: [],
          appliedFilters: new AppliedFilterCollection(),
          rehydrateCount: 0,
        },
      })
    })

    it('selecting a sub-filter', async () => {
      const traitToTest = traitFilterOptions[0]
      const mainDropdown = wrapper.findAllComponents(Select).find(s => s.props('title') === 'Choose a filter')
      mainDropdown?.vm.$emit('change', traitFilter.name)
      await nextTick()

      const subDropdown = wrapper.findAllComponents(Select).find(s => s.props('title') === traitFilter.name)
      expect(subDropdown).toBeDefined()

      // Check that the sub-dropdown options are correct for the trait filter
      expect(mainDropdown?.props('options')).not.toContain(traitFilter.name)

      // Select the trait we're testing
      subDropdown?.vm.$emit('change', traitToTest)
      await nextTick()
      expect(wrapper.emitted('change')).toBeTruthy()

      // The trait we picked should no longer be an option in the sub-dropdown
      expect(subDropdown?.props('options')).not.toContain(traitToTest)

      // Check that the trait filter was added as a tag
      const traitTag = wrapper.findAllComponents(FilterTag).find(tag => tag.props('title') === traitFilter.getTag(traitToTest))
      expect(traitTag).toBeDefined()
    })

    it('selecting a single option sub-filter', async () => {
      const allDropdowns = wrapper.findAllComponents(Select)
      const mainDropdown = allDropdowns.find(s => s.props('title') === 'Choose a filter')
      mainDropdown?.vm.$emit('change', singleOptionFilter.name)
      await nextTick()
      expect(wrapper.emitted('change')).toBeTruthy()

      // only the main dropdown should be rendered, the single option filter shouldn't have a sub-dropdown
      expect(wrapper.findAllComponents(Select).length).toEqual(allDropdowns.length)

      // Check that the sub-dropdown options are correct for the trait filter
      expect(mainDropdown?.props('options')).not.toContain(singleOptionFilter.name)

      // Check that the single option filter was added as a tag
      const singleOption = wrapper.findAllComponents(FilterTag).find(tag => tag.props('title') === singleOptionFilter.getTag(''))
      expect(singleOption).toBeDefined()

      expect(wrapper.emitted('change')).toBeTruthy()
    })
  })

  describe('removing filters', () => {
    beforeEach(() => {
      traitFilter.options = [...traitFilterOptions]
      const traitToTest = traitFilterOptions[0]

      const appliedFilters = new AppliedFilterCollection()
      appliedFilters.addFilter(traitFilter, traitToTest)
      appliedFilters.addFilter(singleOptionFilter, '')

      wrapper = shallowMount(FilterManager, {
        props: {
          filterList: [traitFilter, singleOptionFilter],
          levelOptions: [],
          appliedFilters,
          rehydrateCount: 0,
        },
      })
    })

    it('closing a sub-dropdown restores the filter name to the main dropdown', async () => {
      // Remove the trait
      const subDropdown = wrapper.findAllComponents(Select).find(s => s.props('title') === traitFilter.name)
      subDropdown?.vm.$emit('close')
      await nextTick()

      const mainDropdown = wrapper.findAllComponents(Select).find(s => s.props('title') === 'Choose a filter')
      expect(mainDropdown?.props('options')).toContain(traitFilter.name)

      // The tag should still be applied since we only closed the sub-dropdown, not the tag
      const traitTag = wrapper.findAllComponents(FilterTag).find(tag => tag.props('title') === traitFilter.getTag(traitFilterOptions[0]))
      expect(traitTag).toBeDefined()
      expect(wrapper.emitted('change')).toBeFalsy()
    })

    it('closing a tag restores the option to the sub-dropdown and removes it from applied filters', async () => {
      const traitToTest = traitFilterOptions[0]
      const traitTag = wrapper.findAllComponents(FilterTag).find(tag => tag.props('title') === traitFilter.getTag(traitToTest))
      traitTag?.vm.$emit('close')
      await nextTick()
      expect(wrapper.emitted('change')).toBeTruthy()

      const subDropdown = wrapper.findAllComponents(Select).find(s => s.props('title') === traitFilter.name)
      expect(subDropdown?.props('options')).toContain(traitToTest)

      const appliedFilters = wrapper.props('appliedFilters') as AppliedFilterCollection
      expect(appliedFilters.getAppliedValues(traitFilter)).not.toContain(traitToTest)
    })

    it('changing a filter tag state updates applied filters', async () => {
      const traitToTest = traitFilterOptions[0]
      const traitTag = wrapper.findAllComponents(FilterTag).find(tag => tag.props('title') === traitFilter.getTag(traitToTest))
      traitTag?.vm.$emit('change', FilterState.excludes)
      await nextTick()

      const appliedFilters = wrapper.props('appliedFilters') as AppliedFilterCollection
      expect(appliedFilters.getAppliedState(traitFilter, traitToTest)).toBe(FilterState.excludes)
    })

    it('sub-dropdown shows updated options when filter options change and rehydrateCount increases', async () => {
      const newOption = 'newTrait'
      traitFilter.options = [traitFilterOptions[1], newOption]
      let subDropdown = wrapper.findAllComponents(Select).find(s => s.props('title') === traitFilter.name)
      expect(subDropdown?.props('options')).toEqual([traitFilterOptions[1]])

      await wrapper.setProps({ rehydrateCount: 1 })

      subDropdown = wrapper.findAllComponents(Select).find(s => s.props('title') === traitFilter.name)
      expect(subDropdown?.props('options')).toEqual([traitFilterOptions[1], newOption])
    })

    it('removing a single option filter tag restores it to the main dropdown', async () => {
      const imageTag = wrapper.findAllComponents(FilterTag).find(tag => tag.props('title') === singleOptionFilter.getTag(''))
      imageTag?.vm.$emit('close')
      await nextTick()
      expect(wrapper.emitted('change')).toBeTruthy()

      const mainDropdown = wrapper.findAllComponents(Select).find(s => s.props('title') === 'Choose a filter')
      expect(mainDropdown?.props('options')).toContain(singleOptionFilter.name)

      const appliedFilters = wrapper.props('appliedFilters') as AppliedFilterCollection
      expect(appliedFilters.getAppliedValues(singleOptionFilter)).toHaveLength(0)
    })
  })
})
