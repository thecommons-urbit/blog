import Urbit from '@urbit/http-api'

// generic scry function
export async function scryUrbit (app: string, path: string) {
  const urbit = new Urbit('')
  return await urbit.scry({ app, path })
}
