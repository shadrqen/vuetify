import './VTreeview.sass'

// Components
import { VTreeviewChildren } from './VTreeviewChildren'

// Composables
import { makeNestedProps, useNested } from '@/composables/nested/nested'
import { makeTagProps } from '@/composables/tag'
import { makeDensityProps, useDensity } from '@/composables/density'

// Utilities
import { computed, ref, toRef } from 'vue'
import { defineComponent, useRender } from '@/util'

// Types
import type { PropType } from 'vue'
import { provideDefaults } from '@/composables/defaults'

export type TreeviewItem = {
  [key: string]: any
  $children?: (string | TreeviewItem)[]
}

export type InternalTreeviewItem = {
  props?: Record<string, any>
  children?: InternalTreeviewItem[]
}

const parseItems = (items?: (string | TreeviewItem)[]): InternalTreeviewItem[] | undefined => {
  if (!items) return undefined

  return items.map(item => {
    if (typeof item === 'string') return { value: item, title: item }

    const { $children, ...props } = item

    return { props, children: parseItems($children) }
  })
}

export const VTreeview = defineComponent({
  name: 'VTreeview',

  props: {
    items: Array as PropType<any[]>,
    selectOnClick: Boolean,
    ...makeNestedProps(),
    ...makeTagProps(),
    ...makeDensityProps(),
  },

  emits: {
    'update:selected': (val: string[]) => true,
    'update:opened': (val: string[]) => true,
    'click:expand': (value: { id: string, value: unknown }) => true,
  },

  setup (props, { slots, emit }) {
    const { open, select } = useNested(props)

    const items = computed(() => parseItems(props.items))
    const { densityClasses } = useDensity(props, 'v-treeview')

    provideDefaults(ref({
      VTreeviewItem: {
        selectOnClick: toRef(props, 'selectOnClick'),
      },
    }))

    useRender(() => (
      <props.tag
        class={[
          'v-treeview',
          densityClasses.value,
        ]}
      >
        { slots.default?.() ?? (
          <VTreeviewChildren items={ items.value }>
            {{
              default: slots.default,
            }}
          </VTreeviewChildren>
        ) }
      </props.tag>
    ))

    return {
      open,
      select,
    }
  },
})
