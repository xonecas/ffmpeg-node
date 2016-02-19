<h1>FFMPEG-NODE</h1>

<p>Node.js module to control ffmpeg</p>
<h3>To install</h3>
<code>npm install ffmpeg-node</code>

<h3>Usage</h3>:

<code>   ffmpeg.call(
      [ ... ],                 // array of ffmpeg flags
      callback                 // function to call after ffmpeg is done
   );
   </code>

<p>Examples:</p>

<p>   See file test.js

These are the ffmpeg commands used by the module for the convenience methods.
(If you know how to improve them for better quality/speed, please let me know).</p>

 <code>  mp4:

   ffmpeg -i ./test.3gp \
      -acodec libfaac -ab 128k -ar 41000 \
      -vcodec libx264 -vpre slow -vpre baseline -s 640x360 -r 25 \
      ./test.mp4


   ogg:

   ffmpeg -i ./test.3gp \
      -acodec libvorbis -ab 128k -ar 41000 \
      -vcodec libtheora -s 640x360 -r 30 \
      ./test.ogg

   webm:

   ffmpeg -i ./test.3gp \
      -acodec libvorbis -ab 128k -ar 41000 \
      -vcodec libvpx -s 640x360 -b 614400 -aspect 16:9 \
      ./video.webm

</code>
