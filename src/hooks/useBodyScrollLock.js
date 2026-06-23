import { useEffect } from 'react';

// Lock body scroll while a sheet is open (mobile filter sheet).
// iOS Safari ignores `overflow:hidden` on the body — the page still rubber-bands
// and the URL bar can disappear behind a fixed sheet — so we use the scroll-position
// pattern: freeze the body in place via `position:fixed; top:-scrollY`, then restore
// on unlock. Composes cleanly with anything else that touched body styles by
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