import { cookies } from 'next/headers';

const COOKIE_NAME = 'farmonitor_active_plant_key';

export function getActivePlantKey() {
  return cookies().get(COOKIE_NAME)?.value ?? null;
}

export function getActivePlantCookieName() {
  return COOKIE_NAME;
}
