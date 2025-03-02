<script lang="ts" setup>
import type {ItemSource} from '~/composables/item-types'
import {actionToImage} from '~/composables/item-types'
import markdownit from 'markdown-it'
import {ref} from 'vue';
import {Opportunity} from '@element-plus/icons-vue';

const { source, isBookmarked } = defineProps<{
  source: ItemSource
  isBookmarked?: boolean
}>()
const emit = defineEmits<{
  bookmarkClick: []
}>()

const md = markdownit({ html: true })
function GetDescription(markdown: string) {
  const split = markdown.indexOf('---')
  return md.render(markdown.substring(split + 3))
}

const features = GetFeatures(source.markdown);
function GetFeatures(markdown: string) {
  return markdown.match(/<column.*?(<row.*<\/row>).*?<\/column>/s)[1]
      .replaceAll(/\*\* ?\r\n/gs, "** ")
      .matchAll(/\*\*(.+?)\*\* (.+?)[\n\r]/gs)
      .toArray()
      .map(a => [a[1], md.renderInline(a[2])]);
}

const traits = source.trait ? source.trait.filter((trait) => trait.toLowerCase() !== source.rarity): []
const card_type = source.spell_type || source.type;

const bookmarkColor = ref(isBookmarked ? '#409efc' : 'black' )
function handleBookmark() {
  bookmarkColor.value = isBookmarked ? '#409efc' : 'black' 
  emit('bookmarkClick')
}
</script>

<template>
  <div class="cardSize">
    <div class="item">
      <div class="stretcher-bearer">
        <div class="stretcher">
          <div class="listview-title">
            {{ source.name }} <div v-if="source.actions_number < 7" class="action-holder">
              <img :src="actionToImage[source.actions]" class="action-icon" :alt="source.actions">
            </div>
          </div>
        </div>
        <div class="listview-item-level">
          {{ card_type }} {{ source.level }}
        </div>

        <el-icon :size="24" class="bookmark-icon" :color="bookmarkColor" @click="handleBookmark">
          <Opportunity v-if="isBookmarked" />
          <CollectionTag v-else />
        </el-icon>

      </div>
      <hr class="divider">
      <div class="trait" :class="{uncommon: source.rarity === 'uncommon', rare: source.rarity === 'rare'}">{{ source.rarity }}</div>
      <div v-for="trait in traits" :key="trait" class="trait">
        {{ trait }}
      </div>

      <div class="item-desc">
        <div v-for="[feature, value] in features" :key="feature" class="item">
          <b>{{feature}}</b> <span v-html="value" />
        </div>
      </div>
      
      <hr class="divider" v-if="features.length > 0" /> 
      <div class="item-desc">
        <span class="item-markdown" v-html="GetDescription(source.markdown)" />
      </div>
      <div class="copyright">
        {{ source.primary_source }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cardSize {
  width: 100%;
  padding: 12px;
}

hr.divider {
  margin: 2px 0;
  border: 0.5px solid;
  padding: 0;
}

.item-desc {
  padding: 4px;
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
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  vertical-align: middle;
  margin: 0;
  display: inline-block;
}

.listview-item-level {
  float: right;
}

.trait {
  padding: 4px;
  text-transform: uppercase;
  font-weight: 700;
  margin: 2px;

  background-color: #500000;
  font-size: 0.7em;
  color: white;
  display: inline-block;
  border: 1px solid black;
}
.trait.uncommon {
  background-color: #c45500;
}
.trait.rare {
  background-color: #0c1466;
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
</style>
