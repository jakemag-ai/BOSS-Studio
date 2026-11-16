#!/bin/sh
# cut out the presenter for the three split-screen stretches of the AI team Reel
PY=tools/.venv-matte/Scripts/python.exe
SRC=remotion/public/first-ai-team/pres/presenter-src.mp4
OUT=remotion/public/first-ai-team/pres
CROP=460,130,1000,950
$PY tools/matte/matte.py $SRC $OUT/cut-point.webm --start 10.8 --end 23.3 --crop $CROP
$PY tools/matte/matte.py $SRC $OUT/cut-step2.webm --start 47.1 --end 65.8 --crop $CROP
$PY tools/matte/matte.py $SRC $OUT/cut-end.webm --start 101.9 --end 124.2 --crop $CROP
echo ALLDONE
