import type { CookieOptions } from 'express';
import type { Options as RateLimitOptions } from 'express-rate-limit';

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  USER_NOT_FOUND: 'Usuario no encontrado',
  USER_INACTIVE: 'Usuario inactivo',
  EMAIL_ALREADY_REGISTERED: 'Email ya registrado',
  USERNAME_ALREADY_REGISTERED: 'El nombre de usuario ya está registrado',
  ROL_NOT_FOUND: 'Rol no encontrado',
  SESION_NOT_FOUND: 'Sesión no encontrada',
  CATALOGO_NOT_FOUND: 'Catálogo no encontrado',
  CATALOGO_VALOR_NOT_FOUND: 'Valor no encontrado',
  CATALOGO_CLAVE_IN_USE: (clave: string) => `La clave ${clave} ya está en uso.`,
  SESSION_NOT_FOUND: 'Session not found',
  USER_NOT_REGISTERED: 'User not registered',
  REFRESH_TOKEN_MISSING: 'Refresh token missing from cookie',
  AUTH_TOKEN_MISSING_INVALID: 'Token faltante / invalido',
  AUTH_TOKEN_INVALID: 'Token invalido',
  AUTH_TOKEN_INVALID_RESPONSE: 'Token de autenticación inválido.',
  CLAVES_REQUIRED: "Se requiere el parámetro 'claves' separado por comas.",
  INTERNAL_TOKEN_ERROR: 'Fallo al generar el token',
} as const;

export const COOKIE_OPTIONS = {
  refreshToken: {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  } satisfies CookieOptions,
  refreshTokenClear: {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  } satisfies CookieOptions,
} as const;

export const RATE_LIMIT = {
  global: {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas peticiones desde esta IP, por favor intenta después de 15 minutos',
  } satisfies Partial<RateLimitOptions>,
  auth: {
    windowMs: 60 * 1000,
    max: 5,
    message: 'Demasiados intentos de autenticación, por favor intenta después de 1 minuto',
  } satisfies Partial<RateLimitOptions>,
} as const;

export const BODY_SIZE_LIMIT = '100kb';

export type ErrorMessages = typeof ERROR_MESSAGES;
export type CookieOptionsMap = typeof COOKIE_OPTIONS;
export type RateLimitConfig = typeof RATE_LIMIT;
