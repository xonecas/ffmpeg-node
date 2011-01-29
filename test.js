var ffmpeg = require('./ffmpeg-node.js');

/*
ffmpeg.command('./test.3gp', {
   'acodec': 'libfaac',
   'ab': '128k',
   'ar': '41000'
   }, {
   'vcodec': 'libx264',
   'vpre': ['slow', 'baseline'],
   'r': '25'
   }, {
   'width': '640',
   'height': '360'
   }, './test.mp4', function () {

      console.log('it worked');

   });
*/

/*
ffmpeg.toMp4('./test.3gp', {
   'width': '640',
   'height': '360'
   }, function () {

      console.log('it worked');

   });
*/


ffmpeg.toOgg('./test.3gp', {
   'width': '640',
   'height': '360'
   }, function () {

      console.log('it worked');

   });
