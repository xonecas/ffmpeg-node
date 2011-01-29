// doc missing, dog ate it

var path = require('path'),
   exec = require('child_process').exec;

exports.command = function (input, audio, video, format, output, callback) {
   path.exists(input, function (exists) {
      if (exists) {
         var command = 'ffmpeg -i '+ input +' ';

         if (typeof audio === 'object') {
            for (flag in audio) {
               command += '-'+ flag +' '+ audio[flag] +' ';
            }
         }

         if (typeof video === 'object') {
            for (flag in video) {
               var value = video[flag];

               if (flag === 'vpre' && typeof value === 'object') {
                  value.forEach(function (preset) {
                     command += '-vpre '+ preset +' ';
                  });
               }
               else if (typeof value === 'string') {
                  command += '-'+ flag +' '+ value +' ';
               }
               else 
                  throw new TypeError('Presets must be a string or an array of strings.');
            }
         }

         if (typeof format === 'object' &&
            typeof format.width === 'string' &&
            typeof format.height === 'string') {

            command += '-s '+ format.width +'x'+ format.height +' ';
         }
         
         if (typeof output === 'string') {
            command += output;
         }
         else
            throw new SyntaxError('Output must be a fileName.containerFormat: '+ output);

         exec(command , function (error, stdout, stderr) {
            if (error) 
               throw new Error('ffmpeg didn\'t finish successfully: '+ stderr);
            else 
               callback();
         });
      }
      else
         throw new ReferenceError('File not found: '+ input);
   });
}

exports.toMp4 = function (input, format, callback) {

   var output = path.dirname(input) +'/'+
      path.basename(input, path.extname(input)) +'.mp4';
   
   this.command(input, {
      'acodec': 'libfaac',
      'ab': '128k',
      'ar': '41000'
   }, {
      'vcodec': 'libx264',
      'vpre': ['slow', 'baseline'],
      'r': '25'
   }, format, output, callback);
}

exports.toOgg = function(input, format, callback) {
   var output = path.dirname(input) +'/'+
      path.basename(input, path.extname(input)) +'.ogg';
   
   this.command(input, {
      'acodec': 'libvorbis',
      'ab': '128k',
      'ar': '41000'
   }, {
      'vcodec': 'libtheora',
      'r': '25'
   }, format, output, callback);
}







