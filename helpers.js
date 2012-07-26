/*
* @description Converts an object without nested object properties e.g. {'-key1': 'String1', '-key2': 'String2'} into an array like ['-key1','-String1','-key2','-String2']. If you need a key twice put the values into an array
* @example
* objectToArray({'-vpre': ['slow', 'baseline'], '-vcodec': 'libx264'})
* returns ['-vpre','slow','-vpre','baseline','-vcodec','libx264']
* @param {Object} obj
* @returns {Array} arr
*/

var objectToArray =  exports.objectToArray = function (obj) {
	var arr = [], key;
	
	for (key in obj) {
		var objectValue = obj[key];
		if(objectValue instanceof Array) {
			objectValue.forEach(function (elm, i) {
				arr.push(key, elm);
			});
		} else {
			arr.push(key, objectValue);
		}
	}

	return arr;
};
