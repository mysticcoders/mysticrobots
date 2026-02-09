import { useEffect, useRef, useCallback } from 'react';

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

/**
 * Detects swipe gestures on a ref element and calls the matching direction callback.
 */
export function useSwipe(ref, { onUp, onDown, onLeft, onRight, threshold = 30 }) {
  const start = useRef(null)

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0]
    start.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleTouchEnd = useCallback((e) => {
    if (!start.current) return
    const touch = e.changedTouches[0]
    const dx = touch.clientX - start.current.x
    const dy = touch.clientY - start.current.y
    start.current = null

    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) onRight?.()
      else onLeft?.()
    } else {
      if (dy > 0) onDown?.()
      else onUp?.()
    }
  }, [onUp, onDown, onLeft, onRight, threshold])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [ref, handleTouchStart, handleTouchEnd])
}