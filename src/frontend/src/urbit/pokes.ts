import type Urbit from '@urbit/http-api'
import { type BlogAction } from '../types/blog'

// helper function for null callbacks
function emptyFunction (): void {}

// generic poke functions
export function pokeBlog (urbit: Urbit, action: BlogAction, onError?: () => void, onSuccess?: () => void) {
  const pokeInput = {
    app: 'blog',
    mark: 'blog-action',
    json: action,
    onError: (typeof onError !== 'undefined') ? onError : emptyFunction,
    onSuccess: (typeof onSuccess !== 'undefined') ? onSuccess : emptyFunction
  }

  urbit.poke(pokeInput)
}

// TODO could we narrow down action type from any?
export function pokeUrbit (urbit: Urbit, app: string, mark: string, action: any, onError?: () => void, onSuccess?: () => void) {
  const pokeInput = {
    app,
    mark,
    json: action,
    onError: (typeof onError !== 'undefined') ? onError : emptyFunction,
    onSuccess: (typeof onSuccess !== 'undefined') ? onSuccess : emptyFunction
  }

  urbit.poke(pokeInput)
}
