<script lang="ts" setup>
import type { Card } from '~/composables/types'
import markdownit from 'markdown-it'
import mila from 'markdown-it-link-attributes'
import { useActionImage } from '~/composables/action-to-image'
import { useAonLink } from '~/composables/aon-link'

const { source, isBookmarked } = defineProps<{
  source: Card
  isBookmarked?: boolean
  isPrint?: boolean
}>()
const emit = defineEmits<{
  bookmarkClick: []
}>()

const md = markdownit({ html: true })
md.normalizeLink = function (link: string) {
  if (link.startsWith('http')) {
    return link
  }
  return useAonLink(link)
}
md.use(mila, {
  attrs: {
    target: '_blank',
  },
})

const traits = source.trait ? source.trait_raw.filter(trait => trait.toLowerCase() !== source.rarity) : []
const card_type = source.spell_type || source.type
const show_rarity = !['creature', 'deity'].includes(source.category)
const show_size = !!source.size
</script>

<template>
  <div class="cardSize" :class="{ print: isPrint, notPrint: !isPrint }">
    <div class="item">
      <div class="stretcher-bearer">
        <div class="stretcher">
          <div class="listview-title">
            {{ source.name }}
            <div v-if="source.actions_number < 7" class="action-holder">
              <img :src="useActionImage(source.actions)" class="action-icon" :alt="source.actions">
            </div>
          </div>
        </div>
        <div class="listview-item-level">
          {{ card_type }} {{ source.level }}
        </div>

        <div v-if="!isPrint" class="buttons">
          <BookmarkButton :is-bookmarked="isBookmarked" @click="emit('bookmarkClick')" />
          <LinkButton :link="source.url" />
        </div>
      </div>
      <hr class="divider">
      <div v-if="show_rarity" class="trait" :class="source.rarity?.toLowerCase()">
        {{ source.rarity }}
      </div>
      <div v-if="show_size" class="trait size">
        {{ source.size[0] }}
      </div>
      <div v-for="trait in traits" :key="trait" class="trait">
        {{ trait }}
      </div>

      <div v-if="source.features" class="item-desc item-features">
        <div v-for="(value, feature) in source.features" :key="feature" class="feature">
          <b>{{ feature }}</b> <span v-html="md.renderInline(value)" />
        </div>
      </div>

      <hr v-if="source.features" class="divider">
      <div class="item-desc">
        <span class="item-markdown" v-html="md.render(source.description)" />
      </div>
      <div v-if="!isPrint" class="copyright">
        {{ source.primary_source }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
hr.divider {
  margin: 2px 0;
  border: 0.5px solid;
  padding: 0;
}

.print hr.divider {
  margin: 0 0 2px 0;
}

.notPrint .item-desc {
  padding: 4px;
}

.item-features {
  display: flex;
  flex-wrap: wrap;
}
.print .feature {
  padding-right: 0.25rem;
}
.notPrint .feature {
  padding-right: 0.4rem;
}

.bookmark-icon {
  padding-left: 8px;
}

.stretcher {
  flex: 1;
}

.stretcher-bearer {
  display: flex;
}

.notPrint .stretcher-bearer {
  align-items: center;
}

.listview-title {
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  vertical-align: middle;
  margin: 0;
  display: inline-block;
}

.listview-item-level {
  font-size: 0.8rem;
  float: right;
}

.trait {
  text-transform: uppercase;
  font-weight: 700;
  margin: 2px 2px 1px 2px;

  background-color: #500000;
  font-size: 0.7em;
  color: white;
  display: inline-block;
  border: 1px solid black;
}
.notPrint .trait {
  padding: 4px;
}
.print .trait {
  padding: 1px 2.5px 1px 2.5px;
}

// Special trait background colors
.trait {
  &.uncommon {
    background-color: #c45500;
  }

  &.rare {
    background-color: #0c1466;
  }

  &.size {
    background-color: #478c42;
  }
}

.action-holder {
  width: auto;
  display: inline-block;
  margin-right: 0.3em;
  padding-bottom: 0.1em;
}

.action-icon {
  display: inline;
  margin-right: 0.3em;
  padding-bottom: 0.1em;
  vertical-align: middle;
  height: 1em;
}

.copyright {
  font-style: italic;
  color: grey;
  font-size: 0.9em;
  padding-top: 4px;
}

.item-markdown:deep() {
  p {
  margin: 0;
  }

  row {
    display: flex;
  }

  @media screen and (max-width: 40em) {
  row {
    flex-wrap: wrap;
  }
  }

  img {
    height: 15rem;
  }
}

.print .item-markdown:deep() {
  img {
    display: none;
  }
}

.print .item {
  break-inside: avoid;
  line-height: 13px;
  overflow: hidden;
  height: 100%;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
}

.cardSize.notPrint {
  width: 100%;
  padding: 12px;
}
.cardSize.print {
  flex: none;
  display: block;
  background:
    linear-gradient(to right, black 0.5px, transparent 0.5px) 0 0,
    linear-gradient(to right, black 0.5px, transparent 0.5px) 0 100%,
    linear-gradient(to left, black 0.5px, transparent 0.5px) 100% 0,
    linear-gradient(to left, black 0.5px, transparent 0.5px) 100% 100%,
    linear-gradient(to bottom, black 0.5px, transparent 0.5px) 0 0,
    linear-gradient(to bottom, black 0.5px, transparent 0.5px) 100% 0,
    linear-gradient(to top, black 0.5px, transparent 0.5px) 0 100%,
    linear-gradient(to top, black 0.5px, transparent 0.5px) 100% 100%;
  background-repeat: no-repeat;
  background-size: 20px 20px;

  padding: 7px;

  height: 325px;
  overflow: hidden;
}

.buttons {
  display: flex;
  margin-right: -8px;
}

</style>
