import type { Card } from '../../src/composables/types'
import type { SearchEntry } from './cleaner'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { cleanSearch } from './cleaner'

describe('cleanSearch', () => {
  it.each([
    'background',
    'phantomwolf',
    'topplingfurniture',
    'acid_grip',
    'animal_feature',
    'folklore_enthusiast',
    'energy_breath',
    'shapingsweet',
    'ort_creature',
    'ringofdiscretion',
    'striking_rune',
    'shuriken',
    'legerdemain_handkerchief_equipment',
  ])('%s - cleans single input', (input) => {
    runTestForFilePrefix(`singleInput/${input}`)
  })

  it.skip('runs a single test as expected', () => {
    runTestForFilePrefix('singleInput/ringofdiscretion')
  })

  it.skip('builds up a test as expected', () => {
    buildExpectedForPrefix('singleInput/ringofdiscretion')
  })

  it('adds skills to the associated actions', () => {
    // First, process the skill to save the associated actions
    runTestForFilePrefix('addSkillToAction/stealth')
    // Second, process the associated action
    const output = runTestForFilePrefix('addSkillToAction/sneak')

    expect(output.associated_skill).toEqual(['Stealth'])
  })
})

/*
 * Function definitions for the tests
 */
function readDataFromFile(filename: string): any {
  const destinationDir = path.join(process.cwd(), '/src/scraper/testdata', filename)
  const rawData = readFileSync(destinationDir, { encoding: 'utf8', flag: 'r' })
  return JSON.parse(rawData)
}
function readInputFromFile(filename: string): SearchEntry {
  return readDataFromFile(`${filename}.input.json`) as SearchEntry
}
function readExpectedFromFile(filename: string): Card {
  return readDataFromFile(`${filename}.expected.json`) as Card
}

function writeExpectedToFile(filename: string, expected: Card) {
  const destinationDir = path.join(process.cwd(), '/src/scraper/testdata')
  const destination = path.join(destinationDir, `${filename}.expected.json`)

  writeFileSync(
    destination,
    JSON.stringify(expected),
  )
}

function buildExpectedForPrefix(prefix: string) {
  const inputData = readInputFromFile(prefix)
  const output = cleanSearch([inputData])
  expect(output).toHaveLength(1)
  const data = output[0]
  writeExpectedToFile(prefix, data)
}

function runTestForFilePrefix(prefix: string): Card {
  const inputData = readInputFromFile(prefix)
  const expected = readExpectedFromFile(prefix)
  const output = cleanSearch([inputData])
  expect(output).toHaveLength(1)
  const data = output[0]
  expect(data).toEqual(expected)
  return data
}
