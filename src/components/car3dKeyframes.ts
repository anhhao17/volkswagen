import * as THREE from "three";

/**
 * Shared camera keyframes for the 3D car walk-through.
 *
 * The car is centered at origin, scaled so its longest side is ~4 units,
 * sitting on the ground (y=0). Cabin is roughly y in [0.5, 1.2].
 *
 * Timeline: exterior front-3/4 -> side -> through the side window ->
 * inside the cabin -> look around -> pull back out to exterior rear.
 */

export type Vec3 = [number, number, number];

export interface Keyframe {
  pos: Vec3;
  target: Vec3;
}

export const MODEL_URL = "/models/toycar.glb";

export const KEYFRAMES: Keyframe[] = [
  { pos: [4.5, 2.6, 5.5], target: [0, 0.5, 0] },       // 0.00 exterior front-right
  { pos: [6.0, 1.4, 0.5], target: [0, 0.5, 0] },       // 0.18 side view, low
  { pos: [2.2, 1.1, 0.4], target: [0, 0.85, 0] },      // 0.40 close to side window
  { pos: [0.2, 0.95, 0.1], target: [0, 0.85, -1.2] },  // 0.58 inside cabin, looking forward
  { pos: [-0.6, 1.0, 0.6], target: [-1.4, 0.8, -1.0] },// 0.75 inside, looking across
  { pos: [-0.2, 1.0, -0.4], target: [1.2, 0.8, -1.0] },// 0.88 inside, looking back
  { pos: [-4.5, 2.6, -5.5], target: [0, 0.5, 0] },     // 1.00 exterior rear-left
];

export const BEATS: { at: number; label: string }[] = [
  { at: 0.0, label: "Exterior" },
  { at: 0.4, label: "Step closer" },
  { at: 0.58, label: "Inside the cabin" },
  { at: 0.88, label: "Look around" },
  { at: 1.0, label: "Back outside" },
];

export function beatFor(p: number): string {
  let current = BEATS[0];
  for (const b of BEATS) {
    if (p >= b.at) current = b;
  }
  return current.label;
}

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();

export function sampleKeyframes(
  p: number,
  outPos: THREE.Vector3,
  outTarget: THREE.Vector3
) {
  const clamped = THREE.MathUtils.clamp(p, 0, 1);
  const seg = clamped * (KEYFRAMES.length - 1);
  const i = Math.min(Math.floor(seg), KEYFRAMES.length - 2);
  const t = seg - i;
  const a = KEYFRAMES[i];
  const b = KEYFRAMES[i + 1];
  tmpA.set(...a.pos);
  tmpB.set(...b.pos);
  outPos.copy(tmpA).lerp(tmpB, t);
  tmpA.set(...a.target);
  tmpB.set(...b.target);
  outTarget.copy(tmpA).lerp(tmpB, t);
}
