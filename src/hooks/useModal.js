import { useEffect } from 'react';

// Lock body scroll while a modal/sheet is open. iOS Safari ignores
// `overflow:hidden` on the body — the page still rubber-bands and the URL bar
// can disappear behind a fixed modal — so we use the scroll-position pattern:
// freeze the body in place via `position:fixed; top:-scrollY`, then restore on
// unlock. Composes cleanly with anything else that touched body styles by
// snapshotting prior values and restoring them.
export const useBodyScrollLock = (enabled) => {
  useEffect(() => {
    if (!enabled) return;
    const body = document.body;
    const html = document.documentElement;

    const scrollY = window.scrollY;
    const prev = {
      bodyPosition: body.style.position,
      bodyTop:      body.style.top,
      bodyLeft:     body.style.left,
      bodyRight:    body.style.right,
      bodyWidth:    body.style.width,
      bodyOverflow: body.style.overflow,
      htmlScroll:   html.style.scrollBehavior,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    html.style.scrollBehavior = 'unset';
    return () => {
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.left = prev.bodyLeft;
      body.style.right = prev.bodyRight;
      body.style.width = prev.bodyWidth;
      body.style.overflow = prev.bodyOverflow;
      html.style.scrollBehavior = prev.htmlScroll;
      window.scrollTo(0, -scrollY);
    };
  }, [enabled]);
};

// Trap keyboard focus inside a modal:
// - On open: store previously-focused element, focus the modal (or its first
//   tabbable descendant).
// - While open: Tab and Shift+Tab cycle focus inside the modal only — Tab from
//   the last tabbable wraps to the first; Shift+Tab from the first wraps to
//   the last.
// - On close: restore focus to the element that was focused before the modal
//   opened, so keyboard users land back where they were.
//
// Pass a ref to the modal's root element. `enabled` lets the same hook be used
// for conditionally-rendered modals.
const TABBABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const getTabbable = (root) =>
  Array.from(root.querySelectorAll(TABBABLE)).filter(
    (el) => !el.hasAttribute('aria-hidden') && el.offsetParent !== null
  );

export const useFocusTrap = (ref, enabled = true) => {
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const initial = document.activeElement;
    const first = getTabbable(ref.current)[0];
    if (first) first.focus();
    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      const tabbables = getTabbable(ref.current);
      if (!tabbables.length) return;
      const isShift = e.shiftKey;
      const current = document.activeElement;
      const currentIndex = tabbables.indexOf(current);
      let target = null;
      if (current === first && isShift) {
        target = tabbables[tabbables.length - 1];
      } else if (current === tabbables[tabbables.length - 1] && !isShift) {
        target = first;
      } else if (currentIndex === -1) {
        target = isShift ? tabbables[tabbables.length - 1] : first;
      } else if (isShift) {
        target = tabbables[currentIndex - 1];
      } else {
        target = tabbables[currentIndex + 1];
      }
      if (target) {
        e.preventDefault();
        target.focus();
      }
    };
    const container = ref.current;
    container.addEventListener('keydown', onKey);
    return () => container.removeEventListener('keydown', onKey);
  }, [ref, enabled]);
};

// Unified modal behavior hook that combines scroll lock + focus trap
// Provides a single interface for modal management with consistent API
export const useModal = (ref, enabled = true) => {
  useBodyScrollLock(enabled);
  useFocusTrap(ref, enabled);
};