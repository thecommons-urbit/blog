import Urbit from "@urbit/http-api";

export const api = new Urbit('', '', window.desk)
api.ship = window.ship

if (import.meta.env.DEV) {
  api.verbose = true;
}