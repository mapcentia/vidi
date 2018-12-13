/**
 * @author Rich Gwozdz
 */

var Testing = (function(module){
	
	module.assertEqual = function(val1, val2, msg){
		if(val1 !== val2) {
			console.log(msg + ' ' + (val1 + " does not equal " + val2) || (val1 + " does not equal " + val2));
		}	
	}; 
	
	return module;
	
}(Testing || {}));

exports.Testing = Testing;