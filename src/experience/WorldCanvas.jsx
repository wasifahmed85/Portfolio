import React from 'react';

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * One fixed WebGL canvas behind the whole site. three.js is loaded after first paint,
 * so the hero copy renders immediately; a CSS aurora stands in until (or instead of) WebGL.
 */
export default function WorldCanvas() {
  const canvasRef = React.useRef(null);
  const [status, setStatus] = React.useState('loading');

  React.useEffect(() => {
    if (!supportsWebGL()) {
      setStatus('fallback');
      return undefined;
    }

    let world = null;
    let cancelled = false;
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const boot = async () => {
      try {
        const { World, detectQualityTier } = await import('./world/World');
        if (cancelled || !canvasRef.current) return;
        world = new World({
          canvas: canvasRef.current,
          tier: detectQualityTier(),
          reducedMotion: reducedQuery.matches,
          onReady: () => !cancelled && setStatus('ready'),
          onContextLost: () => !cancelled && setStatus('fallback'),
        });
        world.start();
      } catch (error) {
        console.warn('3D scene unavailable, using fallback.', error);
        if (!cancelled) setStatus('fallback');
      }
    };

    const idle = window.requestIdleCallback || ((cb) => window.setTimeout(cb, 120));
    const cancelIdle = window.cancelIdleCallback || window.clearTimeout;
    const handle = idle(boot, { timeout: 900 });

    const onReducedChange = () => {
      if (!world) return;
      world.reducedMotion = reducedQuery.matches;
      world.stop();
      world.start();
    };
    reducedQuery.addEventListener('change', onReducedChange);

    return () => {
      cancelled = true;
      cancelIdle(handle);
      reducedQuery.removeEventListener('change', onReducedChange);
      world?.dispose();
    };
  }, []);

  return (
    <div className={`world world-${status}`} aria-hidden="true">
      <div className="world-fallback">
        <span className="aurora aurora-a" />
        <span className="aurora aurora-b" />
        <span className="aurora aurora-c" />
      </div>
      {status !== 'fallback' ? <canvas ref={canvasRef} className="world-canvas" /> : null}
      <div className="world-grain" />
      <div className="world-vignette" />
    </div>
  );
}
