// Components
import { VTreeviewGroup } from './VTreeviewGroup'
import { VTreeviewItem } from './VTreeviewItem'

// Utilities
import { genericComponent } from '@/util'

// Types
import type { MakeSlots } from '@/util'
import type { Prop } from 'vue'
import type { InternalTreeviewItem } from './VTreeview'
import type { TreeviewGroupActivatorSlot } from './VTreeviewGroup'

export const VTreeviewChildren = genericComponent<new <T extends InternalTreeviewItem>() => {
  $props: {
    items?: T[]
  }
  $slots: MakeSlots<{
    // default: []
    header: [TreeviewGroupActivatorSlot]
    item: [T]
    // title: [ListItemTitleSlot]
    // subtitle: [ListItemSubtitleSlot]
  }>
}>()({
  name: 'VTreeviewChildren',

  props: {
    items: Array as Prop<InternalTreeviewItem[]>,
  },

  setup (props, { slots }) {
    return () => slots.default?.() ?? props.items?.map(({ children, props: itemProps }) => {
      return children ? (
        <VTreeviewGroup
          value={ itemProps?.value }
          leaf={ !children }
        >
          {{
            default: () => (
              <VTreeviewChildren items={ children } v-slots={ slots } />
            ),
            activator: ({ props: activatorProps }) => slots.header
              ? slots.header({ ...itemProps, ...activatorProps })
              : <VTreeviewItem { ...itemProps } { ...activatorProps } />,
          }}
        </VTreeviewGroup>
      ) : (
        slots.item ? slots.item(itemProps) : <VTreeviewItem { ...itemProps } v-slots={ slots } />
      )
    })
  },
})
