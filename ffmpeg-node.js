
/**
 * Module to drive ffmpeg video enconding library with shortcuts
 * for web video. Requires a  ffmpeg compiled with support for mp4/ogg/webm.
 */

var path = require('path'),
    spawn = require('child_process').spawn,
    that = this,
    queue = [],
    maxActive = 5, // Maximum of active FFMpeg jobs
    active = 0;


// The queue is limited to a max. of 5 active ffmpeg processes.


function push (job) {
   queue.push(job);
   if(active < maxActive) {
      next();
   }
}

function next () {
   if(queue.length > 0 && active < maxActive) {
      console.log(queue[0]);
      that.exec(queue[0].params, queue[0].callback);
      active++;
      queue.shift();
   }
}



/**
 * Description:
 *    calls ffmpeg with the specified flags and returns the output
 *    to the callback function.
 *
 * Parameters:
 * params - an array of ffmpeg options, ex: ['-i','./test.3gp']
 * callback - a function to call when ffmpeg is done, ex:
 *    function (stderr, stdout, exitCode) { ... }
 */

exports.exec = function (params, callback) {
   console.log(params, callback);
   
   if (params instanceof Array && params.length > 2) {

      var stderr = '', stdout = '',
         ffmpeg = spawn('ffmpeg', params);

      ffmpeg.stderr.on('data', function (err) {
         stderr += err;
      });

      ffmpeg.stdout.on('data', function (output) {
         stdout += output;
      });

      ffmpeg.on('exit', function (code) {
         callback(stderr, stdout, code);
         active--;
         next();
      });

   }

};


/**
 * Description:
 *    serves as middle man for convenience method, required to
 *    avoid code repetition.
 *
 * Parameters:
 * type - one of 'mp4', 'ogg', 'webm', 'mp3', 'm4a' as a string.
 * file - path/to/the/inputFile.ext as a string.
 * params - an array of ffmpeg options to be added to the predefined ones (optional).
 * output - path/to/the/outputFile.ext as a string (optional).
 * callback - function to call when ffmpeg is done, ex:
 *    function (stderr, stdout, exitCode) { ... }
 */


exports.convert = function (/* overloaded */) {

   var type = arguments[0], file = arguments[1],
      params = [], output = '', callback = false;

   if (arguments.length === 3) {
      params = [],
      output = path.dirname(file) +'/'+ path.basename(
         file, path.extname(file)) +'.'+ type,
      callback = arguments[2];
   }
   else if (arguments.length > 3) {
      var err = false;

      if (arguments[2] instanceof Array &&
         typeof arguments[3] === 'string' &&
         arguments[4] instanceof Function) {

         params = arguments[2];
         output = arguments[3];
         callback = arguments[4];
      }
      else if (arguments[2] instanceof Array &&
         arguments[3] instanceof Function) {

         params = arguments[2];
         callback = arguments[3];
      }
      else if (typeof arguments[2] === string &&
         arguments[3] instanceof Function) {

         output = arguments[2];
         callback = arguments[3];
      }
      else if (arguments[2] instanceof Function)
         callback = arguments[2];
      else
         throw new Error("Couldn't parse arguments");

   }
   else
      throw new Error('Not enough arguments');

   switch(type) {
      case 'mp4':
         params = [
            '-i', file,
            '-acodec', 'libfaac',
            '-ab', '128k',
            '-ar', '44100',
            '-vcodec', 'libx264',
            '-vpre', 'slow',
            '-vpre', 'baseline',
            '-r', '25',
            '-y', output
         ].concat(params);
      break;

      case 'ogg':
         params = [
            '-i', file,
            '-acodec', 'libvorbis',
            '-ab', '128k',
            '-ar', '44100',
            '-vcodec', 'libtheora',
            '-r', '25',
            '-y', output
         ].concat(params);
      break;

      case 'webm':
         params = [
            '-i', file,
            '-acodec', 'libvorbis',
            '-ab', '128k',
            '-ar', '44100',
            '-vcodec', 'libvpx',
            '-b', '614400',
            '-aspect', '16:9',
            '-y', output
         ].concat(params);
      break;

      case 'mp3':
         params = [
            '-i', file,
            '-acodec', 'libmp3lame',
            '-ab', '128k',
            '-ar', '44100',
            '-y', output
         ].concat(params);
      break;

      case 'm4a':
         params = [
            '-i', file,
            '-acodec', 'aac',
            '-ab', '64k',
            '-ar', '44100',
            '-y', output
         ].concat(params);
      break;
   }

   
   push({params: params, callback: callback});

};

/**
 * Description:
 *    Convenience methods to convert to popular web formats (flash/html5)
 *    If you know how to improve these default options, let me know.
 *
 * Parameters:
 * file - path/to/the/inputFile.ext as a string.
 * params - an array of ffmpeg options to be added to the predefined ones (optional).
 * output - path/to/the/outputFile.ext as a string (optional).
 * callback - function to call when ffmpeg is done, ex:
 *    function (stderr, stdout, exitCode) { ... }
 */

exports.mp4 = function (/* overloaded */) {

   var unshift = Array.prototype.unshift;
   unshift.call(arguments, 'mp4');

   this.convert.apply(this, arguments);

};

exports.ogg = function (/* overloaded */) {

   var unshift = Array.prototype.unshift;
   unshift.call(arguments, 'ogg');

   this.convert.apply(this, arguments);

};

exports.webm = function (/* overloaded */) {

   var unshift = Array.prototype.unshift;
   unshift.call(arguments, 'webm');

   this.convert.apply(this, arguments);

};

exports.mp3 = function (/* overloaded */) {

   var unshift = Array.prototype.unshift;
   unshift.call(arguments, 'mp3');

   this.convert.apply(this, arguments);

};

exports.m4a = function (/* overloaded */) {

   var unshift = Array.prototype.unshift;
   unshift.call(arguments, 'm4a');

   this.convert.apply(this, arguments);

};

