<script lang="ts" setup>
import type { ItemSource } from '~/composables/item-types'
import markdownit from 'markdown-it'
import { actionToImage } from '~/composables/item-types'

const { source } = defineProps<{
  source: ItemSource
}>()

const md = markdownit({ html: true })
function GetDescription(markdown: string) {
  const split = markdown.indexOf('---')
  return md.render(markdown.substring(split + 3))
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
          {{ source.spell_type }} {{ source.level }}
        </div>
      </div>
      <hr>
      <div v-for="trait in source.trait" :key="trait" class="trait trait-common">
        {{ trait }}
      </div>
      <div class="item-desc">
        <hr>
        <span class="item-markdown" v-html="GetDescription(source.markdown)" />
      </div>
      <div class="copyright">
        {{ source.primary_source }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
hr {
  margin: 0 0 2px 0;
  border: 0.5px solid;
  padding: 0;
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
}

.listview-item-level {
  font-size: 0.8rem;
  float: right;
}

.trait {
  padding: 1px 2.5px 1px 2.5px;
  text-transform: uppercase;
  font-weight: 700;
  margin: 2px 2px 1px 2px;

  background-color: #500000;
  font-size: 0.9em;
  color: white;
  display: inline-block;
  border: 1px solid black;
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

.item {
  break-inside: avoid;
  line-height: 13px;
  overflow: hidden;
  height: 100%;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
}

.cardSize {
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

.copyright {
  //visibility: hidden;
  font-style: italic;
  color: grey;
  font-size: 0.9em;
  text-align: end;
}
</style>

<!--
<div class="cardSize">
  <div class="item">
    <div class="stretcher-bearer">
      <div class="stretcher">
        <div class="listview-title">Bullhorn <div class="action-holder"><img src="img/action_double_black.png?v=dm-1" class="action-icon"></div></div>
      </div>
      <div class="listview-item-level">Cantrip 1</div>
    </div>
    <hr>
    <div class="trait trait-common">Auditory</div>
    <div class="trait trait-common">Cantrip</div>
    <div class="trait trait-common">Concentrate</div>
    <div class="trait trait-common">Illusion</div>
    <div class="trait trait-common">Manipulate</div>
    <div class="item-desc">
      <b>Duration</b> 10 minutes
      <hr>
      You amplify your voice, loud enough for you to be heard easily at a great distance. For the duration, your voice can be heard loudly and clearly by all listeners within 500 feet, even if other ambient noise would otherwise block the sound. Despite the volume, this doesn't make your voice jarring or distracting. This doesn't increase the range or area of other auditory or linguistic effects, and physical barriers such as walls and doors still block or muffle your voice as normal. Your loud voice makes it easier to Coerce others, and the acoustics assist in Performing at a large venue. You gain a +1 status bonus to checks to Coerce and auditory Performance checks to Perform at a large venue. You can Dismiss the spell. <br><b>Heightened (5th)</b> Your voice can be heard clearly up to 1,200 feet away.<br><b>Heightened (7th)</b> Your voice can be heard clearly up to 1 mile away.
    </div>
    <div class="copyright">PC2</div>
    <br>
    <br>
    <br>
  </div>
</div>

-->
