
/**
 * Module to drive ffmpeg video enconding library with shortcuts
 * for web video. Requires a  ffmpeg compiled with support for mp4/ogg/webm.
 */

var path = require('path'),
    _ = require('underscore'),
    child_process = require('child_process'),
    spawn = child_process.spawn,
    helpers = require('./helpers.js'),
    that = this,
    queue = exports.queue = [],
    maxActive = 4, // Maximum of active FFMpeg jobs
    active = 0;



function push (job) {
   queue.push(job);
   if(active < maxActive) {
      next();
   }
}

function next () {
   if(queue.length > 0 && active < maxActive) {
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
 * params - an object of ffmpeg options, ex: {'-i': './test.3gp', '-vpre': ['slow', 'baseline'], '-vcodec': 'libx264'}
 * callback - a function to call when ffmpeg is done, ex:
 *    function (stderr, stdout, exitCode) { ... }
 */

exports.exec = function (params, callback) {
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

   } else {
      if (params instanceof Array && params.length <= 2) {
         console.log('Params to short for ffmpeg');
         active--;
         next();
      }
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
 * params - an object of ffmpeg options to be added to the predefined ones (optional).
 * output - path/to/the/outputFile.ext as a string (optional).
 * callback - function to call when ffmpeg is done, ex:
 *    function (stderr, stdout, exitCode) { ... }
 */


exports.convert = function (/* overloaded */) {

   var type = arguments[0],
       file = arguments[1],
       params = {}, output = '',
       callback = false;

   if (arguments.length === 3) {
      params = {},
      output = path.dirname(file) +'/'+ path.basename(
         file, path.extname(file)) +'.'+ type,
      callback = arguments[2];
   }
   else if (arguments.length > 3) {
      var err = false;

      if (arguments[2] instanceof Object &&
         typeof arguments[3] === 'string' &&
         arguments[4] instanceof Function) {

         params = arguments[2];
         output = arguments[3];
         callback = arguments[4];
      }
      else if (arguments[2] instanceof Object &&
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


   // Here the params array should be modified into an object which can be extend
   switch(type) {
      case 'mp4':
         params = helpers.objectToArray(_({
            '-i': file,
            '-acodec': 'aac',
            '-ab': '128k',
            '-ar': '44100',
            '-vcodec': 'libx264',
            '-vpre': ['slow','baseline'],
            '-r': '25',
            '-y': output
         }).extend(params));
      break;

      case 'ogg':
         params = helpers.objectToArray(_({
            '-i': file,
            '-acodec': 'libvorbis',
            '-ab': '128k',
            '-ar': '44100',
            '-vcodec': 'libtheora',
            '-r': '25',
            '-y': output
         }).extend(params));
      break;

      case 'webm':
         params = helpers.objectToArray(_({
            '-i': file,
            '-acodec': 'libvorbis',
            '-ab': '128k',
            '-ar': '44100',
            '-vcodec': 'libvpx',
            '-b': '614400',
            '-aspect': '16:9',
            '-y': output
         }).extend(params));
      break;

      case 'mp3':
         params = helpers.objectToArray(_({
            '-i': file,
            '-acodec': 'libmp3lame',
            '-ab': '128k',
            '-ar': '44100',
            '-y': output
         }).extend(params));
      break;

      case 'm4a':
         params = helpers.objectToArray(_({
            '-i': file,
            '-acodec': 'aac',
            '-ab': '64k',
            '-ar': '44100',
            '-strict': '-2',
            '-y': output
         }).extend(params));
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

/*
*  The function takes a absolute file path and returns a meta data object
*  @params {String} input
*  @params {Callback} callback function(error, jsonMetaObject)
*/

exports.getMetadata = function (input, callback) {
   child_process.exec("ffprobe -loglevel error -show_format -show_streams " + input + " -print_format json", function (error, stdout, stderr) {
      try {
         stdout = JSON.parse(stdout);
         callback(error, stdout);
      } catch (e) {
         callback(error, stdout);
      }
   });
};