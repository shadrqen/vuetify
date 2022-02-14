// Components
import { VExpandTransition } from '@/components/transitions'

// Composables
// import { useList } from './list'
import { makeTagProps } from '@/composables/tag'
import { useNestedGroupActivator, useNestedItem } from '@/composables/nested/nested'

// Utilities
import type { Ref } from 'vue'
import { computed, defineComponent } from 'vue'
import { genericComponent } from '@/util'

// Types
import type { MakeSlots } from '@/util'
import type { InternalTreeviewItem } from './VTreeview'

export type TreeviewGroupActivatorSlot = {
  props: {
    'onClick:prepend': (e: Event) => void
    collapseIcon: string
    expandIcon: string
    class: string
  }
}

const VTreeviewGroupActivator = defineComponent({
  name: 'VTreeviewGroupActivator',

  setup (_, { slots }) {
    useNestedGroupActivator()

    return () => slots.default?.()
  },
})

export const VTreeviewGroup = genericComponent<new <T extends InternalTreeviewItem>() => {
  $props: {
    items?: T[]
  }
  $slots: MakeSlots<{
    activator: [TreeviewGroupActivatorSlot]
    default: []
  }>
}>()({
  name: 'VTreeviewGroup',

  props: {
    collapseIcon: {
      type: String,
      default: '$treeviewCollapse',
    },
    expandIcon: {
      type: String,
      default: '$treeviewExpand',
    },
    value: {
      type: null,
      default: undefined,
    },
    leaf: Boolean,

    ...makeTagProps(),
  },

  setup (props, { slots }) {
    const { isOpen, open, id } = useNestedItem(computed(() => props.value), !props.leaf)

    const activatorProps: Ref<TreeviewGroupActivatorSlot['props']> = computed(() => ({
      'onClick:prepend': (e: Event) => open(!isOpen.value, e),
      collapseIcon: props.collapseIcon,
      expandIcon: props.expandIcon,
      class: 'v-treeview-group__header',
      value: id.value,
    }))

    return () => {
      return (
        <props.tag
          class={[
            'v-treeview-group',
          ]}
        >
          <VTreeviewGroupActivator>
            { slots.activator?.({ props: activatorProps.value }) }
          </VTreeviewGroupActivator>
          <div class="v-treeview-group__items" v-show={ isOpen.value }>
            { slots.default?.() }
          </div>
        </props.tag>
      )
    }
  },
})
