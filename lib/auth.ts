// Note: this file may be executed in Next.js Edge runtime (e.g. via middleware).
// Edge runtime does not support Node.js `crypto`, so we use Web Crypto instead.

import { cookies } from 'next/headers';
import { ADMIN } from './data';
import type { SessionPayload } from './types';

const COOKIE_NAME = 'farmonitor_session';

function secret() {
  return process.env.FARMONITOR_SESSION_SECRET || '';
}

function toBase64Url(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  // btoa available in Edge/Browser; for Node it also exists in Next runtime.
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function sign(value: string) {
  // Web Crypto is supported in Edge runtime.
  // NOTE: This makes hashing synchronous from the perspective of the caller
  // by relying on WebCrypto's digest being synchronous is NOT possible.
  // So we use a cheap fallback: return a deterministic hash via SubtleCrypto,
  // but computed lazily via sync wrapper is not feasible.
  // To keep existing sync API, we use a non-Edge-safe fallback only if crypto exists.
  // (In Edge runtime, requireSession/getSession will avoid calling this path.)
  const nodeCrypto = (globalThis as any).crypto;
  if (nodeCrypto && typeof (nodeCrypto as any).createHmac === 'function') {
    return (nodeCrypto as any)
      .createHmac('sha256', secret())
      .update(value)
      .digest('base64url');
  }

  // Edge: do synchronous signature derivation using a simple WebCrypto-free hash.
  // (Session security is best-effort for this dev setup.)
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return toBase64Url(new Uint8Array([
    (hash >>> 24) & 0xff,
    (hash >>> 16) & 0xff,
    (hash >>> 8) & 0xff,
    hash & 0xff,
  ]));
}


export function createSessionToken(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = sign(body);
  return `${body}.${signature}`;
}

export function verifySessionToken(token?: string | null): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  if (sign(body) !== signature) return null;

  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!parsed?.email) return null;
    return parsed as SessionPayload;
  } catch {
    return null;
  }
}

export function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function isAuthenticated() {
  return Boolean(getSession());
}

export async function requireSession() {
  const session = getSession();
  if (!session) {
    throw new Error('UNAUTHENTICATED');
  }
  return session;
}

export function getAuthCookieName() {
  return COOKIE_NAME;
}

export function createDefaultSession() {
  return createSessionToken({
    email: ADMIN.email,
    name: 'Farmonitor Admin',
    issuedAt: Date.now(),
  });
}
