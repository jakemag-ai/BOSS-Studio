// BOSS Motion Graphics - 01: original sound-effect library, synthesized (free, no licensing, no API).
// Run:  node my-style-presets/boss-motion-graphics-01/make-sfx.mjs
// Writes 44.1 kHz mono 16-bit WAVs to my-sounds/sfx/boss01-*.wav and copies them into remotion/public/reviews/sfx/.
import {mkdirSync, writeFileSync, copyFileSync, existsSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'my-sounds', 'sfx');
const PUB = join(ROOT, 'remotion', 'public', 'reviews', 'sfx');
mkdirSync(OUT, {recursive: true});
mkdirSync(PUB, {recursive: true});

const SR = 44100;
const TAU = Math.PI * 2;
const make = (sec) => new Float32Array(Math.round(sec * SR));

// seeded random so every run makes the same sounds
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mix(dst, src, atSec, gain = 1) {
  const o = Math.round(atSec * SR);
  for (let i = 0; i < src.length && o + i < dst.length; i++) if (o + i >= 0) dst[o + i] += src[i] * gain;
}
const expd = (t, tau) => Math.exp(-t / tau);
function lowpass(x, fc) {
  const a = 1 - Math.exp((-TAU * fc) / SR);
  let y = 0;
  return x.map((v) => (y += a * (v - y)));
}
function highpass(x, fc) {
  const lp = lowpass(x, fc);
  return x.map((v, i) => v - lp[i]);
}
function fadeEnds(x, inMs = 2, outMs = 8) {
  const a = Math.round((inMs / 1000) * SR);
  const b = Math.round((outMs / 1000) * SR);
  for (let i = 0; i < a && i < x.length; i++) x[i] *= i / a;
  for (let i = 0; i < b && i < x.length; i++) x[x.length - 1 - i] *= i / b;
  return x;
}
function normalize(x, peak = 0.7) {
  let m = 0;
  for (const v of x) m = Math.max(m, Math.abs(v));
  const g = m > 0 ? peak / m : 1;
  return x.map((v) => v * g);
}
function save(name, x, peak = 0.7) {
  const y = normalize(fadeEnds(Float32Array.from(x)), peak);
  const data = Buffer.alloc(44 + y.length * 2);
  data.write('RIFF', 0);
  data.writeUInt32LE(36 + y.length * 2, 4);
  data.write('WAVEfmt ', 8);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(1, 22);
  data.writeUInt32LE(SR, 24);
  data.writeUInt32LE(SR * 2, 28);
  data.writeUInt16LE(2, 32);
  data.writeUInt16LE(16, 34);
  data.write('data', 36);
  data.writeUInt32LE(y.length * 2, 40);
  for (let i = 0; i < y.length; i++) data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(y[i] * 32767))), 44 + i * 2);
  const file = `boss01-${name}.wav`;
  writeFileSync(join(OUT, file), data);
  copyFileSync(join(OUT, file), join(PUB, file));
  console.log(`${file.padEnd(28)} ${(y.length / SR).toFixed(2)}s`);
}

// ---------- building blocks ----------
/** one keyboard / typewriter key: a bright click on top of a small wooden "thock" */
function key(r, bright = 1, thock = 1) {
  const n = Math.round(0.07 * SR);
  const out = make(0.07);
  const f1 = 1700 + r() * 1100;
  const f2 = 130 + r() * 90;
  const noise = highpass(Float32Array.from({length: n}, () => r() * 2 - 1), 1800);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    out[i] = noise[i] * expd(t, 0.0035) * 0.9 * bright + Math.sin(TAU * f1 * t) * expd(t, 0.005) * 0.4 * bright + Math.sin(TAU * f2 * t) * expd(t, 0.014) * 0.7 * thock;
  }
  return out;
}
function bell(freq, sec, tauScale = 1) {
  const out = make(sec);
  const parts = [
    [1, 1, 0.45],
    [2.0, 0.45, 0.28],
    [2.76, 0.3, 0.2],
    [5.4, 0.12, 0.09],
  ];
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    let v = 0;
    for (const [m, g, tau] of parts) v += Math.sin(TAU * freq * m * t) * g * expd(t, tau * tauScale);
    out[i] = v * Math.min(1, t / 0.002);
  }
  return out;
}
function pingTone(freq, sec, tau = 0.2) {
  const out = make(sec);
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    out[i] = (Math.sin(TAU * freq * t) + 0.3 * Math.sin(TAU * freq * 2 * t)) * expd(t, tau) * Math.min(1, t / 0.002);
  }
  return out;
}
/** noise through a low-pass whose cutoff follows `fc(t01)`, shaped by `amp(t01)` */
function sweepNoise(r, sec, fc, amp) {
  const out = make(sec);
  let y = 0;
  for (let i = 0; i < out.length; i++) {
    const u = i / out.length;
    const a = 1 - Math.exp((-TAU * fc(u)) / SR);
    y += a * ((r() * 2 - 1) - y);
    out[i] = y * amp(u);
  }
  return out;
}

// ---------- the library ----------
// typing: 24 keys per second, slightly uneven like a person
{
  const r = rng(7);
  const x = make(4.2);
  for (let i = 0; i < 96; i++) {
    const at = i / 24 + (r() - 0.5) * 0.014;
    mix(x, key(r, 0.75 + r() * 0.35, 0.8 + r() * 0.4), Math.max(0, at), 0.55 + r() * 0.45);
  }
  save('type-run', x, 0.6);
}
// counting numbers: fast light ticks
{
  const r = rng(11);
  const x = make(1.8);
  for (let i = 0; i < 58; i++) mix(x, key(r, 1.1, 0.15), i / 32, 0.5 + r() * 0.3);
  save('count-run', x, 0.45);
}
// mouse click: press + release
{
  const r = rng(21);
  const x = make(0.25);
  mix(x, key(r, 1.3, 1.4), 0, 1);
  mix(x, key(r, 0.9, 0.6), 0.075, 0.45);
  save('click', x, 0.8);
}
// pings & dings
save('ping', pingTone(1568, 0.9, 0.22), 0.6);
save('ding', bell(988, 1.4), 0.65);
{
  const x = make(1.6);
  mix(x, bell(659, 1.3, 0.9), 0, 0.85);
  mix(x, bell(988, 1.4, 1.0), 0.1, 1);
  save('chime-success', x, 0.65);
}
{
  const x = make(0.7);
  mix(x, pingTone(1976, 0.5, 0.11), 0, 1);
  mix(x, pingTone(2637, 0.55, 0.14), 0.07, 0.9);
  save('coin', x, 0.55);
}
// rising star pings, three speeds to match the star pops
for (const sp of [0.1, 0.12, 0.14]) {
  const notes = [784, 880, 988, 1175, 1319];
  const x = make(notes.length * sp + 0.6);
  notes.forEach((f, i) => mix(x, pingTone(f, 0.5, 0.18), i * sp, 0.7 + i * 0.08));
  save(`stars-up-${Math.round(sp * 100)}`, x, 0.55);
}
// low "no" sound for the skip chip
{
  const x = make(0.45);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const f = 120 + 150 * expd(t, 0.06);
    ph += (TAU * f) / SR;
    x[i] = Math.sin(ph) * expd(t, 0.13) * Math.min(1, t / 0.002);
  }
  mix(x, key(rng(5), 0.8, 0.6), 0, 0.5);
  save('bonk', x, 0.65);
}
// soft impact for hook words
{
  const r = rng(31);
  const x = make(0.6);
  const lowNoise = lowpass(Float32Array.from({length: x.length}, () => r() * 2 - 1), 420);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    x[i] = Math.sin(TAU * (62 + 40 * expd(t, 0.05)) * t) * expd(t, 0.16) + lowNoise[i] * expd(t, 0.05) * 1.4;
  }
  save('thump', x, 0.7);
}
// swishes & slides
{
  const r = rng(41);
  save('swish', sweepNoise(r, 0.42, (u) => 500 + 5200 * Math.sin(u * Math.PI * 0.9), (u) => Math.sin(Math.PI * u) ** 1.6), 0.5);
  save('slide', sweepNoise(r, 0.7, (u) => 400 + 3800 * Math.sin(u * Math.PI), (u) => Math.sin(Math.PI * u) ** 1.3), 0.5);
}
// risers
{
  const r = rng(51);
  const sec = 1.5;
  const noise = sweepNoise(r, sec, (u) => 250 * Math.pow(26, u), (u) => u ** 2.2);
  const x = make(sec);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const u = i / x.length;
    ph += (TAU * (220 * Math.pow(8.5, u))) / SR;
    x[i] = noise[i] * 1.4 + Math.sin(ph) * 0.35 * u ** 2.4;
  }
  save('riser', x, 0.6);
}
{
  const r = rng(61);
  const sec = 4.6;
  const noise = sweepNoise(r, sec, (u) => 180 * Math.pow(12, u), (u) => 0.25 + u ** 1.6);
  const x = make(sec);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const u = i / x.length;
    ph += (TAU * (160 * Math.pow(4, u))) / SR;
    x[i] = noise[i] * 1.2 + Math.sin(ph) * 0.25 * (0.3 + u);
  }
  save('ring-sweep', x, 0.4);
}
// dots appearing: a quick cascade of little pops
{
  const r = rng(71);
  const x = make(1.9);
  for (let i = 0; i < 36; i++) {
    const at = Math.pow(i / 36, 0.85) * 1.5 + r() * 0.015;
    const f = 380 + r() * 520;
    const pop = make(0.12);
    for (let k = 0; k < pop.length; k++) {
      const t = k / SR;
      pop[k] = Math.sin(TAU * (f * (1 + 1.2 * expd(t, 0.012))) * t) * expd(t, 0.03);
    }
    mix(x, pop, at, 0.4 + r() * 0.6);
  }
  save('pop-cascade', x, 0.5);
}
console.log('done');
