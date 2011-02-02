var ffmpeg = require('./ffmpeg-node.js');

ffmpeg.mp4(
   './test.3gp',
   ['-s', '720x480'], 
   './test.mp4',
   function (err, out, code) {
      console.log(err, out, code);
   }
);

