import {
  CameraKeyframe,
  DESKTOP_FRAMES,
  MASTER_PLATE_URL,
  MOBILE_FRAMES,
  TOTAL_FRAMES,
} from '../data/sequenceConfig';

export type ViewportProfile = 'desktop' | 'mobile';

export interface InterpolatedCameraState {
  cx: number;
  cy: number;
  zoom: number;
  tiltDeg: number;
  vignette: number;
  specularShift: number;
  redBloom: number;
  frameIndex: number;
}

function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function sampleCameraState(
  frames: CameraKeyframe[],
  progress: number
): InterpolatedCameraState {
  const p = clamp(progress, 0, 1);
  const maxIdx = frames.length - 1;
  const scaled = p * maxIdx;
  const idx = Math.min(Math.floor(scaled), maxIdx - 1);
  const t = scaled - idx;

  const k0 = frames[Math.max(0, idx - 1)];
  const k1 = frames[idx];
  const k2 = frames[Math.min(maxIdx, idx + 1)];
  const k3 = frames[Math.min(maxIdx, idx + 2)];

  return {
    cx: clamp(catmullRom(k0.cx, k1.cx, k2.cx, k3.cx, t), 0.12, 0.88),
    cy: clamp(catmullRom(k0.cy, k1.cy, k2.cy, k3.cy, t), 0.25, 0.78),
    zoom: clamp(catmullRom(k0.zoom, k1.zoom, k2.zoom, k3.zoom, t), 0.45, 2.2),
    tiltDeg: catmullRom(k0.tiltDeg, k1.tiltDeg, k2.tiltDeg, k3.tiltDeg, t),
    vignette: clamp(catmullRom(k0.vignette, k1.vignette, k2.vignette, k3.vignette, t), 0.1, 0.8),
    specularShift: clamp(
      catmullRom(k0.specularShift, k1.specularShift, k2.specularShift, k3.specularShift, t),
      0,
      1
    ),
    redBloom: clamp(
      catmullRom(k0.redBloom, k1.redBloom, k2.redBloom, k3.redBloom, t),
      0,
      1
    ),
    frameIndex: Math.min(TOTAL_FRAMES, Math.round(scaled) + 1),
  };
}

export function renderCameraFrame(
  ctx: CanvasRenderingContext2D,
  source: HTMLImageElement | ImageBitmap,
  canvasWidth: number,
  canvasHeight: number,
  state: InterpolatedCameraState,
  profile: ViewportProfile
): void {
  const srcW = source instanceof HTMLImageElement ? source.naturalWidth : source.width;
  const srcH = source instanceof HTMLImageElement ? source.naturalHeight : source.height;
  if (!srcW || !srcH || !canvasWidth || !canvasHeight) return;

  ctx.save();
  ctx.fillStyle = '#050507';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Calculate base cover scale for desktop vs height-anchored scale for mobile
  let drawW: number;
  let drawH: number;

  if (profile === 'desktop') {
    const coverScale = Math.max(canvasWidth / srcW, canvasHeight / srcH);
    const totalScale = coverScale * state.zoom;
    drawW = srcW * totalScale;
    drawH = srcH * totalScale;
  } else {
    // On mobile 9:16, zoom = 1.0 fits full master height; zoom = 0.58 fits full master width
    const heightScale = canvasHeight / srcH;
    const totalScale = heightScale * state.zoom;
    drawW = srcW * totalScale;
    drawH = srcH * totalScale;
  }

  // Clamp focal center so edges never expose empty background when zoomed in on desktop
  const viewCenterX = canvasWidth * 0.5;
  const viewCenterY = canvasHeight * 0.5;

  let drawX = viewCenterX - state.cx * drawW;
  let drawY = viewCenterY - state.cy * drawH;

  if (drawW >= canvasWidth) {
    drawX = clamp(drawX, canvasWidth - drawW, 0);
  } else {
    drawX = (canvasWidth - drawW) * 0.5;
  }

  if (drawH >= canvasHeight) {
    drawY = clamp(drawY, canvasHeight - drawH, 0);
  } else {
    // Center vertically with slight downward gravity bias for mobile establishing shot
    drawY = (canvasHeight - drawH) * 0.54;
  }

  // Apply subtle stabilized camera roll around viewport center
  ctx.translate(viewCenterX, viewCenterY);
  ctx.rotate((state.tiltDeg * Math.PI) / 180);
  ctx.translate(-viewCenterX, -viewCenterY);

  // When zoomed out on tall mobile screens, draw seamless studio floor & ceiling continuity
  if (drawH < canvasHeight) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, drawY + drawH * 0.25);
    skyGrad.addColorStop(0, '#050507');
    skyGrad.addColorStop(0.65, '#07080b');
    skyGrad.addColorStop(1, '#090b0e');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(-40, -40, canvasWidth + 80, drawY + drawH * 0.3 + 40);

    const floorTop = drawY + drawH * 0.72;
    const floorGrad = ctx.createLinearGradient(0, floorTop, 0, canvasHeight + 40);
    floorGrad.addColorStop(0, '#16191f');
    floorGrad.addColorStop(0.35, '#0c0e12');
    floorGrad.addColorStop(1, '#050507');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(-40, floorTop, canvasWidth + 80, canvasHeight - floorTop + 80);
  }

  // Draw the master plate at interpolated camera transform
  ctx.drawImage(source, drawX, drawY, drawW, drawH);

  // Feather top/bottom edges cleanly into obsidian studio void when zoomed out on mobile
  if (drawH < canvasHeight) {
    const topFeather = ctx.createLinearGradient(0, drawY - 4, 0, drawY + drawH * 0.16);
    topFeather.addColorStop(0, 'rgba(6, 7, 10, 1)');
    topFeather.addColorStop(1, 'rgba(6, 7, 10, 0)');
    ctx.fillStyle = topFeather;
    ctx.fillRect(-40, drawY - 40, canvasWidth + 80, drawH * 0.16 + 44);

    const bottomEdge = drawY + drawH;
    const bottomFeather = ctx.createLinearGradient(
      0,
      bottomEdge - drawH * 0.18,
      0,
      bottomEdge + 6
    );
    bottomFeather.addColorStop(0, 'rgba(10, 12, 16, 0)');
    bottomFeather.addColorStop(0.65, 'rgba(10, 12, 16, 0.78)');
    bottomFeather.addColorStop(1, 'rgba(9, 11, 15, 1)');
    ctx.fillStyle = bottomFeather;
    ctx.fillRect(-40, bottomEdge - drawH * 0.18, canvasWidth + 80, drawH * 0.18 + 40);
  }

  ctx.restore();

  // Subtle synchronized overhead studio softbox glint sweep
  if (state.specularShift > 0.02) {
    const sweepX = canvasWidth * (0.2 + state.specularShift * 0.65);
    const sweepGrad = ctx.createRadialGradient(
      sweepX,
      canvasHeight * 0.08,
      0,
      sweepX,
      canvasHeight * 0.08,
      canvasWidth * 0.55
    );
    sweepGrad.addColorStop(0, `rgba(225, 232, 242, ${0.07 * state.specularShift})`);
    sweepGrad.addColorStop(0.5, `rgba(180, 192, 208, ${0.025 * state.specularShift})`);
    sweepGrad.addColorStop(1, 'rgba(5, 5, 7, 0)');
    ctx.fillStyle = sweepGrad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  // Subtle crimson ambient glow synchronized with rear haunch / taillight blade frames
  if (state.redBloom > 0.05) {
    const bloomX = profile === 'desktop' ? canvasWidth * 0.78 : canvasWidth * 0.72;
    const bloomY = canvasHeight * 0.5;
    const bloomGrad = ctx.createRadialGradient(
      bloomX,
      bloomY,
      0,
      bloomX,
      bloomY,
      Math.max(canvasWidth, canvasHeight) * 0.42
    );
    bloomGrad.addColorStop(0, `rgba(217, 30, 42, ${0.11 * state.redBloom})`);
    bloomGrad.addColorStop(0.55, `rgba(140, 16, 26, ${0.04 * state.redBloom})`);
    bloomGrad.addColorStop(1, 'rgba(5, 5, 7, 0)');
    ctx.fillStyle = bloomGrad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  // Calibrated cinema optical edge vignette
  const vignetteGrad = ctx.createRadialGradient(
    canvasWidth * 0.5,
    canvasHeight * 0.5,
    Math.min(canvasWidth, canvasHeight) * 0.28,
    canvasWidth * 0.5,
    canvasHeight * 0.5,
    Math.max(canvasWidth, canvasHeight) * 0.78
  );
  vignetteGrad.addColorStop(0, 'rgba(5, 5, 7, 0)');
  vignetteGrad.addColorStop(0.7, `rgba(5, 5, 7, ${0.28 * state.vignette})`);
  vignetteGrad.addColorStop(1, `rgba(5, 5, 7, ${0.86 * state.vignette})`);
  ctx.fillStyle = vignetteGrad;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

export class ProgressiveSequenceLoader {
  private source: HTMLImageElement | ImageBitmap | null = null;
  private bakedDesktop: Array<HTMLCanvasElement | null> = new Array(TOTAL_FRAMES).fill(null);
  private bakedMobile: Array<HTMLCanvasElement | null> = new Array(TOTAL_FRAMES).fill(null);
  private loadedCount = 0;
  private idleHandle: number | null = null;
  private timeoutHandle: ReturnType<typeof setTimeout> | null = null;
  private destroyed = false;

  async init(
    initialProfile: ViewportProfile,
    onInitialReady: (source: HTMLImageElement | ImageBitmap) => void,
    onProgress?: (bakedFrames: number, total: number) => void,
    onError?: () => void
  ): Promise<void> {
    try {
      const img = new Image();
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.src = MASTER_PLATE_URL;

      await new Promise<void>((resolve, reject) => {
        if (img.complete && img.naturalWidth > 0) {
          resolve();
          return;
        }
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load master studio plate'));
      });

      if (this.destroyed) return;

      if (typeof img.decode === 'function') {
        await img.decode().catch(() => undefined);
      }

      if ('createImageBitmap' in window) {
        try {
          this.source = await createImageBitmap(img);
        } catch {
          this.source = img;
        }
      } else {
        this.source = img;
      }

      if (this.destroyed) return;

      // Bake only initial 3 frames immediately to avoid blank flash
      this.bakeFrameSlice(initialProfile, 0, 3);
      onInitialReady(this.source);
      onProgress?.(this.loadedCount, TOTAL_FRAMES);

      // Progressively bake frames 4..18 in idle slices
      this.scheduleProgressiveBaking(initialProfile, 3, onProgress);
    } catch {
      onError?.();
    }
  }

  getSource(): HTMLImageElement | ImageBitmap | null {
    return this.source;
  }

  getBakedFrame(profile: ViewportProfile, indexZeroBased: number): HTMLCanvasElement | null {
    const cache = profile === 'desktop' ? this.bakedDesktop : this.bakedMobile;
    return cache[clamp(indexZeroBased, 0, TOTAL_FRAMES - 1)] ?? null;
  }

  private bakeFrameSlice(profile: ViewportProfile, startIdx: number, count: number): void {
    if (!this.source) return;
    const frames = profile === 'desktop' ? DESKTOP_FRAMES : MOBILE_FRAMES;
    const cache = profile === 'desktop' ? this.bakedDesktop : this.bakedMobile;
    const w = profile === 'desktop' ? 1280 : 540;
    const h = profile === 'desktop' ? 720 : 960;

    const end = Math.min(TOTAL_FRAMES, startIdx + count);
    for (let i = startIdx; i < end; i++) {
      if (cache[i]) continue;
      const offscreen = document.createElement('canvas');
      offscreen.width = w;
      offscreen.height = h;
      const ctx = offscreen.getContext('2d', { alpha: false });
      if (ctx) {
        const kf = frames[i];
        renderCameraFrame(
          ctx,
          this.source,
          w,
          h,
          {
            cx: kf.cx,
            cy: kf.cy,
            zoom: kf.zoom,
            tiltDeg: kf.tiltDeg,
            vignette: kf.vignette,
            specularShift: kf.specularShift,
            redBloom: kf.redBloom,
            frameIndex: kf.frame,
          },
          profile
        );
        cache[i] = offscreen;
        this.loadedCount = Math.min(TOTAL_FRAMES, this.loadedCount + 1);
      }
    }
  }

  private scheduleProgressiveBaking(
    profile: ViewportProfile,
    nextIdx: number,
    onProgress?: (bakedFrames: number, total: number) => void
  ): void {
    if (this.destroyed || nextIdx >= TOTAL_FRAMES) return;

    const run = () => {
      if (this.destroyed) return;
      this.bakeFrameSlice(profile, nextIdx, 2);
      onProgress?.(this.loadedCount, TOTAL_FRAMES);
      if (nextIdx + 2 < TOTAL_FRAMES) {
        this.scheduleProgressiveBaking(profile, nextIdx + 2, onProgress);
      }
    };

    if (typeof window.requestIdleCallback === 'function') {
      this.idleHandle = window.requestIdleCallback(run, { timeout: 250 });
    } else {
      this.timeoutHandle = globalThis.setTimeout(run, 32);
    }
  }

  destroy(): void {
    this.destroyed = true;
    if (this.idleHandle !== null && typeof window.cancelIdleCallback === 'function') {
      window.cancelIdleCallback(this.idleHandle);
      this.idleHandle = null;
    }
    if (this.timeoutHandle !== null) {
      globalThis.clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
    if (this.source && 'close' in this.source && typeof this.source.close === 'function') {
      this.source.close();
    }
    this.source = null;
    this.bakedDesktop = [];
    this.bakedMobile = [];
  }
}
