export const actionToImage = {
  'Reaction': 'action_reaction',
  'Single Action': 'action_single',
  'Two Actions': 'action_double',
  'Three Actions': 'action_triple',
  'Single Action to Three Actions': 'action_range',
  'Free Action': 'action_free',
}

export function useActionImage(type: string): string {
  if (!actionToImage[type]) {
    console.error('no image found for type')
    return type
  }
  return `${import.meta.env.BASE_URL}img/${actionToImage[type]}_black.png`
}

export function useDiceImage(type: number): string {
  return `${import.meta.env.BASE_URL}img/icon_d${type}.png`
}

export function useStatBlock(): string {
  return `${import.meta.env.BASE_URL}img/stat_block.png`
}

export function useWeaponTypeImage(type: string): string {
  return `${import.meta.env.BASE_URL}img/weapon_${type.toLowerCase()}.png`
}
