import { useEffect, useLayoutEffect } from 'react'

/**
 * SSR-safe useLayoutEffect. Falls back to useEffect on the server
 * to avoid React hydration warnings.
 */
export const useSafeLayoutEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect
