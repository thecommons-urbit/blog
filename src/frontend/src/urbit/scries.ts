import Urbit from '@urbit/http-api'

// generic scry function
export function scryUrbit (app: string, path: string) {
  const urbit = new Urbit('')
  return urbit.scry({ app: app, path: path })
}
