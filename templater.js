//simple, handlebars type templater

//takes template as string
//variables are of the form {variableName}
function Templater(templateString){
	this.templateString = templateString;
}

//based on:
//http://stackoverflow.com/questions/1787322/htmlspecialchars-equivalent-in-javascript
Templater.prototype.escapeHTML = function(text){
	if(typeof text === 'number'){
		return text;
	}
	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, function(m) { return map[m]; });
};

//takes context object with keys as variable names
//and values as variable values
//returns string
//keeps markup for non passed variables
Templater.prototype.render = function(context){
	var rendered = this.templateString;
	for (var key in context){
		var searchExp = new RegExp('{\\s*' + key + '\\s*}', 'g');
		rendered = rendered.replace(searchExp, this.escapeHTML(context[key]));
	}
	return rendered;
};
