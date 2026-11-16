"""Cut the speaker out of a video (Robust Video Matting, runs locally on the CPU).

  tools/.venv-matte/Scripts/python.exe tools/matte/matte.py <video> <out.webm> --start 12 --end 22 [--crop x,y,w,h] [--ratio 0.5]

Writes a transparent VP9 .webm (yuva420p) of the cropped region, same frame rate as the source.
Nothing leaves this computer. Model: tools/matte/rvm_mobilenetv3_fp32.torchscript
"""
import argparse
import subprocess
import sys
import time
from pathlib import Path

import numpy as np
import torch

p = argparse.ArgumentParser()
p.add_argument('video')
p.add_argument('out')
p.add_argument('--start', type=float, default=0)
p.add_argument('--end', type=float, required=True)
p.add_argument('--crop', default='460,230,1000,850', help='x,y,w,h in source pixels')
p.add_argument('--ratio', type=float, default=0.5, help='RVM downsample ratio (lower is faster)')
p.add_argument('--fps', type=float, default=25)
a = p.parse_args()

x, y, w, h = [int(v) for v in a.crop.split(',')]
model_path = Path(__file__).with_name('rvm_mobilenetv3_fp32.torchscript')
model = torch.jit.load(str(model_path), map_location='cpu').eval()
torch.set_num_threads(max(1, torch.get_num_threads()))

dec = subprocess.Popen(
    ['ffmpeg', '-loglevel', 'error', '-ss', str(a.start), '-t', str(a.end - a.start), '-i', a.video,
     '-vf', f'fps={a.fps},crop={w}:{h}:{x}:{y}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
    stdout=subprocess.PIPE,
)
enc = subprocess.Popen(
    ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{w}x{h}', '-r', str(a.fps), '-i', '-',
     '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '24', '-auto-alt-ref', '0', '-row-mt', '1', a.out],
    stdin=subprocess.PIPE,
)

frame_bytes = w * h * 3
rec = [None] * 4
n = 0
t0 = time.time()
with torch.no_grad():
    while True:
        buf = dec.stdout.read(frame_bytes)
        if len(buf) < frame_bytes:
            break
        rgb = np.frombuffer(buf, np.uint8).reshape(h, w, 3)
        src = torch.from_numpy(rgb.copy()).permute(2, 0, 1).float().div(255).unsqueeze(0)
        fgr, pha, *rec = model(src, *rec, a.ratio)
        alpha = (pha[0, 0].clamp(0, 1) * 255).byte().numpy()
        out = np.dstack([rgb, alpha])
        enc.stdin.write(out.tobytes())
        n += 1
        if n % 25 == 0:
            print(f'{n} frames, {n / (time.time() - t0):.1f} fps', file=sys.stderr, flush=True)
enc.stdin.close()
enc.wait()
dec.wait()
print(f'done: {n} frames -> {a.out}')
