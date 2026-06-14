<script lang="ts" setup>
import type { Card } from '~/composables/types'
import markdownit from 'markdown-it'
import mila from 'markdown-it-link-attributes'
import { useAonLink } from '~/composables/aon-link'
import { inlinePlugin } from '~/composables/block-inliner'
import { isDark } from '~/composables/dark'
import { imagePlugin } from '~/composables/image-renderer'

const { source, isBookmarked, isPrint } = defineProps<{
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
md.use(imagePlugin, 'inline-action')
md.use(inlinePlugin)

const featuresToFilter = ['favored weapon']

const traits = source.trait_raw ? source.trait_raw.filter(trait => trait.toLowerCase() !== source.rarity) : []
const card_type = source.spell_type || source.type
const show_rarity = source.rarity !== 'common'
const isCreature = source.category === 'creature' && !source.print_image
const isRune = source.item_category && source.item_category.toLowerCase() === 'runes'
const actionString = `<actions string="${source.actions}" />`
const features = source.features.map(f => f.filter(([key, _]) => !(isPrint && featuresToFilter.includes(key.toLowerCase()))))
const isWide = isCreature || (source.xl_card && !source.print_image)
const isSplit = (source.xl_card && !source.print_image) && !isCreature
</script>

<template>
  <div class="cardSize" :class="{ print: isPrint, wide: isWide, rune: isRune, long: isCreature && source.xl_card, split: isSplit, dark: isDark }">
    <div v-if="!source.print_image" class="item">
      <div class="stretcher-bearer">
        <div class="stretcher">
          <div class="listview-title">
            <span class="title">{{ source.name }}</span>
            <span v-if="source.actions_number < 7" class="action-holder" v-html="md.renderInline(actionString, { actionClass: 'action-icon' })" />
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
      <WeaponHeader v-if="isPrint && source.category === 'weapon' && source.damage_die" :source="source" />

      <hr class="divider top-divider">

      <div class="flex">
        <div class="desc-container flex-1">
          <div v-if="show_rarity" class="trait" :class="source.rarity?.toLowerCase()">{{ source.rarity }}</div>
          <div v-if="!!source.size" class="trait green_trait">{{ source.size[0] }}</div>
          <div v-if="source.is_trained" class="trait blue_trait">Trained</div>
          <div v-if="!!source.rune_category" class="trait blue_trait">{{ source.rune_category }}</div>
          <div v-if="!!source.rune_target" class="trait green_trait">{{ source.rune_target }}</div>
          <div v-for="trait in traits" :key="trait" class="trait">{{ trait }}</div>
          <div v-for="skill in source.associated_skill" :key="skill" class="trait size">{{ skill }}</div>

          <div class="further-desc">
            <div v-for="(list, idx) in features" :key="idx">
              <div class="item-desc item-features">
                <div v-for="[feature, value] in list" :key="feature" class="feature" :class="{ newline: feature === 'newline' }">
                  <b v-html="md.renderInline(feature)" /> <span v-html="md.renderInline(value)" />
                </div>
              </div>

              <hr v-if="idx < features.length - 1 || source.description" class="divider">
            </div>

            <div class="item-desc">
              <span class="item-markdown" v-html="md.render(source.description)" />
            </div>
            <div v-if="!isPrint" class="copyright">
              {{ source.primary_source }}
            </div>
            <div v-if="isSplit" />
          </div>

          <div v-for="image in source.image" :key="image" class="item-image">
            <img :src="useAonLink(image)">
          </div>
        </div>
      </div>
    </div>
    <div v-else class="image">
      <div v-for="image in source.image" :key="image">
        <img :src="useAonLink(image)">
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

.item-features {
  display: flex;
  flex-wrap: wrap;

  &:deep() {
    .inline-action {
      height: 14px;
    }
  }
}

.dark .item-features:deep() .inline-action {
  -webkit-filter: invert(1);
  filter: invert(1);
}

.feature.newline {
  flex-basis: 100%;
  b,
  span {
    display: none;
  }
}

.print .feature {
  padding-right: 0.25rem;
}

.cardSize:not(.print) {
  width: 100%;
  padding: 12px;

  .item-desc {
    padding: 4px;
  }

  .feature {
    padding-right: 0.4rem;
  }

  .stretcher-bearer {
    align-items: center;
  }

  .trait {
    padding: 4px;
  }
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

.listview-title {
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  vertical-align: middle;
  margin: 0;
  display: inline-block;

  .title {
    margin-right: 0.2em;
  }

  .action-holder {
    width: auto;
    display: inline-block;
    margin-right: 0.3em;
    padding-bottom: 0.1em;

    &:deep() .action-icon {
      display: inline;
      padding-bottom: 0.1em;
      vertical-align: middle;
      height: 1em;
      margin: 0 -0.1em;
    }
  }
}

.dark .action-holder:deep() .action-icon {
  -webkit-filter: invert(1);
  filter: invert(1);
}

.listview-item-level {
  font-size: 0.8rem;
  float: right;
}

.print.rune .further-desc {
  visibility: hidden;
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

  &.green_trait {
    background-color: #478c42;
  }

  &.blue_trait {
    background-color: #4287f5;
  }
}

.deep .action-holder:deep() .action-icon {
  -webkit-filter: invert(1);
  filter: invert(1);
}

.copyright {
  font-style: italic;
  color: grey;
  font-size: 0.9em;
  padding-top: 4px;
}

.item-markdown {
  &.image {
    width: 20%;
  }
  &:deep() {
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

    img:not(.inline-action) {
      display: none;
    }

    img.inline-action {
      height: 1em;
      margin: 0.3em 0 -0.1em;
    }

    h2 {
      font-size: 1.2em;
      margin-bottom: 0;
    }

    table {
      width: 99%;
      table-layout: fixed;
      border-top: 1px solid #999999;
      border-bottom: 1px solid #999999;
    }
  }
}

.dark .item-markdown:deep() .inline-action {
  -webkit-filter: invert(1);
  filter: invert(1);
}

.item-markdown:deep(),
.feature:deep() {
  table {
    border-collapse: collapse;
    margin: 12px auto 8px;

    tbody tr:nth-child(odd) {
      background-color: #eeeeee;
    }

    th {
      font-size: 1em;
    }

    td {
      padding: 4px;

      &:first-child {
        padding-left: 8px;
      }
      &:last-child {
        padding-right: 8px;
      }

      &:not(td strong) {
        font-size: 0.9em;
      }
    }
  }
}

.item-image {
  width: 18%;
  img {
    width: 100%;
  }
}

.image img {
  width: 100%;
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

  &:deep() a {
    color: inherit;
    text-decoration: none;
  }
  &.wide {
    grid-column: span 2;
  }
  &.long {
    grid-row: span 2;
    height: 650px;
  }
  &.rune {
    grid-row: span 0.25;
    height: 55px;
  }
  &.wide.split {
    background:
      linear-gradient(to left, black 0.5px, transparent 0.5px) 100% 0,
      linear-gradient(to left, black 0.5px, transparent 0.5px) 48% 100%,
      linear-gradient(to left, black 0.5px, transparent 0.5px) 100% 100%,
      linear-gradient(to right, black 0.5px, transparent 0.5px) 0 0,
      linear-gradient(to right, black 0.5px, transparent 0.5px) 52% 0,
      linear-gradient(to right, black 0.5px, transparent 0.5px) 0 100%,
      linear-gradient(to bottom, black 0.5px, transparent 0.5px) 0 0,
      linear-gradient(to bottom, black 0.5px, transparent 0.5px) 50% 0,
      linear-gradient(to bottom, black 0.5px, transparent 0.5px) 100% 0,
      linear-gradient(to top, black 0.5px, transparent 0.5px) 0 100%,
      linear-gradient(to top, black 0.5px, transparent 0.5px) 50% 100%,
      linear-gradient(to top, black 0.5px, transparent 0.5px) 100% 100%;
    background-repeat: no-repeat;
    background-size: 20px 20px;

    .desc-container {
      column-count: 2;
      column-gap: 20px;
    }
    .stretcher-bearer,
    .top-divider {
      width: calc(50% - 7px);
    }
  }
  .item-image {
    display: none;
  }

  .item {
    break-inside: avoid;
    line-height: 13px;
    overflow: hidden;
    height: 100%;
    font-family: 'Roboto', sans-serif;
    font-size: 12px;
    page-break-inside: avoid;
    will-change: transform;
  }

  .item-markdown:deep(),
  .feature:deep() {
    h2 {
      display: none;
    }

    table {
      width: 100%;
      margin: 0;
      table-layout: auto;
      break-inside: avoid;

      th {
        font-size: 0.9em;
      }

      td {
        padding: 2px;
        overflow: clip;
        font-size: 0.9em;

        &:not(td strong) {
          font-size: 0.8em;
        }
      }
    }
  }
}

.buttons {
  display: flex;
  margin-right: -8px;
}
</style>
