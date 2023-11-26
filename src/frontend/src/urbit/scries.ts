import Urbit from '@urbit/http-api'

// generic scry function
// TODO narrow down type from any?
//        the plan is to add more specific scry helpers leveraging this one
export async function scryUrbit (app: string, path: string): Promise<any> {
  const urbit = new Urbit('')
  return await urbit.scry({ app, path })
}
