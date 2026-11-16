#!/bin/sh
# Bake the presenter (rounded video box + transparent cut-out on top) into one aligned, frame-exact
# 30 fps image sequence per split stretch, so Remotion never has to seek a video while rendering.
# Geometry matches remotion/src/aiteam01/AiTeam01.tsx: canvas 900x855, box 900x558 at y=297.
PY=tools/.venv-matte/Scripts/python.exe
SRC=remotion/public/first-ai-team/pres/presenter-src.mp4
DIR=remotion/public/first-ai-team/pres
MASK=remotion/out/pres/boxmask.png
mkdir -p remotion/out/pres

# rounded-corner mask for the video box (radius 44, anti-aliased)
$PY - <<'PYEOF'
import numpy as np, subprocess
w, h, r = 900, 558, 44
y, x = np.mgrid[0:h, 0:w].astype(np.float32)
cx = np.clip(x, r, w - 1 - r)
cy = np.clip(y, r, h - 1 - r)
d = np.sqrt((x - cx) ** 2 + (y - cy) ** 2)
a = np.clip(r + 0.5 - d, 0, 1)
raw = (a * 255).astype(np.uint8).tobytes()
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'gray', '-s', f'{w}x{h}', '-i', '-', '-frames:v', '1', 'remotion/out/pres/boxmask.png'], input=raw, check=True)
PYEOF

EQ="eq=brightness=0.04:contrast=1.06:saturation=1.1"

bake() { # name in out seg segStart
  NAME=$1; IN=$2; OUT=$3; SEG=$4; SEGSTART=$5
  DUR=$(awk "BEGIN{print $OUT-$IN}")
  CUTIN=$(awk "BEGIN{print $IN-$SEGSTART}")
  rm -rf $DIR/f-$NAME && mkdir -p $DIR/f-$NAME
  ffmpeg -y -loglevel error \
    -ss $IN -t $DUR -i $SRC \
    -ss $CUTIN -t $DUR -c:v libvpx-vp9 -i $DIR/$SEG.webm \
    -loop 1 -framerate 25 -t $DUR -i $MASK \
    -filter_complex "[0:v]scale=1728:972,crop=900:558:414:414,$EQ,format=rgba[b0];[2:v]format=gray[m];[b0][m]alphamerge[b];[1:v]scale=900:855,format=rgba,$EQ[c];color=c=black@0:s=900x855:r=25:d=$DUR,format=rgba[bg];[bg][b]overlay=0:297:shortest=1[t1];[t1][c]overlay=0:0:shortest=1,fps=30[out]" \
    -map "[out]" -c:v libwebp -quality 88 -pix_fmt yuva420p -start_number 0 $DIR/f-$NAME/%05d.webp
  echo "baked $NAME: $(ls $DIR/f-$NAME | wc -l) frames"
}

bake point 11.2 22.7 cut-point 10.8
bake step2 47.5 65.3 cut-step2 47.1
bake end 102.3 124.2 cut-end 101.9
echo BAKEDONE
