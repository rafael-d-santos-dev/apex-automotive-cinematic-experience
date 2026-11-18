import masterPlateUrl from '../assets/images/apex_r01_master_plate_1795004771040.jpg';

export const MASTER_PLATE_URL = masterPlateUrl;

export const TOTAL_FRAMES = 18;

export type CameraPhase =
  | 'establishing'
  | 'approach'
  | 'lateral'
  | 'wheel'
  | 'profile'
  | 'finale';

export interface CameraKeyframe {
  frame: number;
  phase: CameraPhase;
  /** Normalized focal center X on master plate (0 = left, 1 = right) */
  cx: number;
  /** Normalized focal center Y on master plate (0 = top, 1 = bottom) */
  cy: number;
  /** Desktop: 1.0 = full width; Mobile: 1.0 = full plate height inside 9:16 */
  zoom: number;
  /** Micro camera roll in degrees for stabilized dolly feel */
  tiltDeg: number;
  /** Radial optical vignette strength (0..1) */
  vignette: number;
  /** Subtle directional studio light sweep intensity (0..1) */
  specularShift: number;
  /** Subtle crimson reflection bloom near rear taillight blade (0..1) */
  redBloom: number;
}

export const DESKTOP_FRAMES: CameraKeyframe[] = [
  { frame: 1, phase: 'establishing', cx: 0.500, cy: 0.500, zoom: 1.00, tiltDeg: 0.00, vignette: 0.28, specularShift: 0.10, redBloom: 0.08 },
  { frame: 2, phase: 'establishing', cx: 0.460, cy: 0.514, zoom: 1.08, tiltDeg: -0.18, vignette: 0.30, specularShift: 0.16, redBloom: 0.08 },
  { frame: 3, phase: 'establishing', cx: 0.405, cy: 0.530, zoom: 1.19, tiltDeg: -0.32, vignette: 0.34, specularShift: 0.24, redBloom: 0.06 },
  { frame: 4, phase: 'approach', cx: 0.340, cy: 0.552, zoom: 1.35, tiltDeg: -0.45, vignette: 0.38, specularShift: 0.32, redBloom: 0.04 },
  { frame: 5, phase: 'approach', cx: 0.275, cy: 0.572, zoom: 1.54, tiltDeg: -0.50, vignette: 0.42, specularShift: 0.40, redBloom: 0.02 },
  { frame: 6, phase: 'approach', cx: 0.246, cy: 0.578, zoom: 1.72, tiltDeg: -0.38, vignette: 0.45, specularShift: 0.48, redBloom: 0.00 },
  { frame: 7, phase: 'lateral', cx: 0.286, cy: 0.562, zoom: 1.82, tiltDeg: -0.20, vignette: 0.44, specularShift: 0.56, redBloom: 0.00 },
  { frame: 8, phase: 'lateral', cx: 0.336, cy: 0.548, zoom: 1.86, tiltDeg: 0.00, vignette: 0.42, specularShift: 0.64, redBloom: 0.00 },
  { frame: 9, phase: 'lateral', cx: 0.385, cy: 0.574, zoom: 1.88, tiltDeg: 0.18, vignette: 0.42, specularShift: 0.60, redBloom: 0.00 },
  { frame: 10, phase: 'wheel', cx: 0.432, cy: 0.614, zoom: 1.92, tiltDeg: 0.30, vignette: 0.46, specularShift: 0.52, redBloom: 0.06 },
  { frame: 11, phase: 'wheel', cx: 0.485, cy: 0.602, zoom: 1.86, tiltDeg: 0.35, vignette: 0.44, specularShift: 0.48, redBloom: 0.10 },
  { frame: 12, phase: 'wheel', cx: 0.555, cy: 0.576, zoom: 1.76, tiltDeg: 0.28, vignette: 0.40, specularShift: 0.54, redBloom: 0.16 },
  { frame: 13, phase: 'profile', cx: 0.640, cy: 0.544, zoom: 1.66, tiltDeg: 0.16, vignette: 0.38, specularShift: 0.62, redBloom: 0.28 },
  { frame: 14, phase: 'profile', cx: 0.735, cy: 0.526, zoom: 1.58, tiltDeg: 0.04, vignette: 0.38, specularShift: 0.70, redBloom: 0.48 },
  { frame: 15, phase: 'profile', cx: 0.802, cy: 0.522, zoom: 1.52, tiltDeg: -0.10, vignette: 0.40, specularShift: 0.66, redBloom: 0.64 },
  { frame: 16, phase: 'finale', cx: 0.710, cy: 0.514, zoom: 1.32, tiltDeg: -0.16, vignette: 0.35, specularShift: 0.46, redBloom: 0.44 },
  { frame: 17, phase: 'finale', cx: 0.595, cy: 0.504, zoom: 1.15, tiltDeg: -0.08, vignette: 0.30, specularShift: 0.28, redBloom: 0.26 },
  { frame: 18, phase: 'finale', cx: 0.506, cy: 0.494, zoom: 1.03, tiltDeg: 0.00, vignette: 0.28, specularShift: 0.16, redBloom: 0.20 },
];

export const MOBILE_FRAMES: CameraKeyframe[] = [
  { frame: 1, phase: 'establishing', cx: 0.500, cy: 0.512, zoom: 0.58, tiltDeg: 0.00, vignette: 0.32, specularShift: 0.12, redBloom: 0.08 },
  { frame: 2, phase: 'establishing', cx: 0.435, cy: 0.528, zoom: 0.72, tiltDeg: -0.18, vignette: 0.34, specularShift: 0.20, redBloom: 0.06 },
  { frame: 3, phase: 'establishing', cx: 0.340, cy: 0.548, zoom: 0.88, tiltDeg: -0.32, vignette: 0.38, specularShift: 0.28, redBloom: 0.04 },
  { frame: 4, phase: 'approach', cx: 0.225, cy: 0.576, zoom: 1.06, tiltDeg: -0.40, vignette: 0.42, specularShift: 0.38, redBloom: 0.02 },
  { frame: 5, phase: 'approach', cx: 0.258, cy: 0.562, zoom: 1.18, tiltDeg: -0.34, vignette: 0.44, specularShift: 0.46, redBloom: 0.00 },
  { frame: 6, phase: 'approach', cx: 0.295, cy: 0.516, zoom: 1.24, tiltDeg: -0.18, vignette: 0.42, specularShift: 0.54, redBloom: 0.00 },
  { frame: 7, phase: 'lateral', cx: 0.345, cy: 0.530, zoom: 1.28, tiltDeg: 0.00, vignette: 0.42, specularShift: 0.62, redBloom: 0.00 },
  { frame: 8, phase: 'lateral', cx: 0.395, cy: 0.575, zoom: 1.32, tiltDeg: 0.16, vignette: 0.44, specularShift: 0.56, redBloom: 0.04 },
  { frame: 9, phase: 'wheel', cx: 0.432, cy: 0.620, zoom: 1.36, tiltDeg: 0.28, vignette: 0.46, specularShift: 0.48, redBloom: 0.08 },
  { frame: 10, phase: 'wheel', cx: 0.462, cy: 0.608, zoom: 1.36, tiltDeg: 0.28, vignette: 0.45, specularShift: 0.44, redBloom: 0.10 },
  { frame: 11, phase: 'wheel', cx: 0.540, cy: 0.578, zoom: 1.26, tiltDeg: 0.20, vignette: 0.42, specularShift: 0.50, redBloom: 0.16 },
  { frame: 12, phase: 'profile', cx: 0.618, cy: 0.512, zoom: 1.18, tiltDeg: 0.10, vignette: 0.40, specularShift: 0.60, redBloom: 0.26 },
  { frame: 13, phase: 'profile', cx: 0.720, cy: 0.536, zoom: 1.20, tiltDeg: 0.00, vignette: 0.40, specularShift: 0.68, redBloom: 0.44 },
  { frame: 14, phase: 'profile', cx: 0.822, cy: 0.524, zoom: 1.24, tiltDeg: -0.14, vignette: 0.44, specularShift: 0.64, redBloom: 0.64 },
  { frame: 15, phase: 'profile', cx: 0.858, cy: 0.538, zoom: 1.14, tiltDeg: -0.18, vignette: 0.42, specularShift: 0.52, redBloom: 0.54 },
  { frame: 16, phase: 'finale', cx: 0.715, cy: 0.524, zoom: 0.86, tiltDeg: -0.10, vignette: 0.36, specularShift: 0.36, redBloom: 0.34 },
  { frame: 17, phase: 'finale', cx: 0.585, cy: 0.514, zoom: 0.69, tiltDeg: -0.04, vignette: 0.33, specularShift: 0.22, redBloom: 0.24 },
  { frame: 18, phase: 'finale', cx: 0.500, cy: 0.510, zoom: 0.59, tiltDeg: 0.00, vignette: 0.32, specularShift: 0.14, redBloom: 0.20 },
];

export interface SequenceChapter {
  id: CameraPhase;
  label: string;
  targetProgress: number;
  frameNumber: number;
}

export const SEQUENCE_CHAPTERS: SequenceChapter[] = [
  { id: 'establishing', label: 'Approach', targetProgress: 0.0, frameNumber: 1 },
  { id: 'approach', label: 'Fascia', targetProgress: 0.26, frameNumber: 5 },
  { id: 'wheel', label: 'Wheel', targetProgress: 0.54, frameNumber: 10 },
  { id: 'profile', label: 'Profile', targetProgress: 0.78, frameNumber: 14 },
  { id: 'finale', label: 'Finale', targetProgress: 1.0, frameNumber: 18 },
];

export interface EditorialBeat {
  id: CameraPhase;
  start: number;
  end: number;
  eyebrow: string;
  headline: string;
  description: string;
  desktopAlign: 'left-bottom' | 'left-mid' | 'right-bottom';
  isFinale?: boolean;
}

export const EDITORIAL_BEATS: EditorialBeat[] = [
  {
    id: 'establishing',
    start: 0.0,
    end: 0.16,
    eyebrow: 'Apex Motorsport · Prototype Series',
    headline: 'APEX R-01',
    description:
      'Low-slung graphite silhouette sculpted for uninterrupted airflow across every surface.',
    desktopAlign: 'left-bottom',
  },
  {
    id: 'approach',
    start: 0.16,
    end: 0.34,
    eyebrow: '01 · Front Architecture',
    headline: 'Blade-Sharp Front Fascia',
    description:
      'Carbon-fiber front splitter and narrow LED light signatures channel air into deep side curtains.',
    desktopAlign: 'right-bottom',
  },
  {
    id: 'lateral',
    start: 0.34,
    end: 0.51,
    eyebrow: '02 · Surface Continuity',
    headline: 'Unbroken Graphite Tension',
    description:
      'Continuous metallic surfacing sweeps cleanly over the front haunch without visual clutter.',
    desktopAlign: 'left-bottom',
  },
  {
    id: 'wheel',
    start: 0.51,
    end: 0.69,
    eyebrow: '03 · Unsprung Precision',
    headline: 'Forged Multi-Spoke Assembly',
    description:
      'Matte titanium-finished ten-spoke wheels frame crimson calipers and functional fender extraction vents.',
    desktopAlign: 'right-bottom',
  },
  {
    id: 'profile',
    start: 0.69,
    end: 0.87,
    eyebrow: '04 · Rear Signature',
    headline: 'Narrow Red Light Blade',
    description:
      'A single razor-thin rear LED trace wraps cleanly around the muscular rear quarter.',
    desktopAlign: 'left-bottom',
  },
  {
    id: 'finale',
    start: 0.87,
    end: 1.01,
    eyebrow: 'APEX R-01 · Continuous Studio Study',
    headline: 'Form Driven by Velocity',
    description:
      'One cohesive stance from nose splitter to rear haunch, captured in a single unbroken motion.',
    desktopAlign: 'left-bottom',
    isFinale: true,
  },
];
