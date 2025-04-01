import { isDark } from '~/composables/dark'

export const actionToImage = {
  'Reaction': 'action_reaction',
  'Single Action': 'action_single',
  'Two Actions': 'action_double',
  'Three Actions': 'action_triple',
  'Single Action to Three Actions': 'action_range',
  'Free Action': 'action_free',
}

export function useActionImage(type: keyof typeof actionToImage): string {
  const suffix = isDark.value ? '' : '_black'
  return `${import.meta.env.BASE_URL}img/${actionToImage[type]}${suffix}.png`
}
