"use strict";
var WDP = {};

WDP.countedSet = function(){
	this.collection = {};
	this.max = 0;
};

WDP.countedSet.prototype.add = function(item) {
	if(this.shouldExcludeItem(item)){
		return;
	}
	item = this.normalizeItemName(item);
	if(this.collection[item]){
		this.collection[item] += 1;
	}
	else{
		this.collection[item] = 1;
	}
	if(this.collection[item] > this.max){
		this.max++;
	}
};

WDP.countedSet.prototype.normalizeItemName = function(item){
	// return item.toLowerCase();
	return item;
}

/*
* Function returning true or false whether item should be added to the set
*/
WDP.countedSet.prototype.shouldExcludeItem = function(item){
	//exclude non letters or numbers and certain words
	return !item || !item.match(/[a-zA-z0-9]/) || item.match(/^(and|to|a|the|of|for|in|with|is|be|our|as|an|or|on|are)$/);
}


/*
* Returns an array sorted in descending order of name and amount
* i.e. [{name: first_thing, amount: 20}, {name: second_thing, amount: 19}];
*/
WDP.countedSet.prototype.getSortedCollection = function() {
	var collection = this.collection; //because can't reference this inside function
	var sortable = [];
	for (var key in collection){
		sortable.push({'name' : key, 'amount' : collection[key], 'percentage_of_max' : collection[key] * 1.0 / this.max * 100});	
	} 
	sortable.sort(function(a, b) {return -(a['amount'] - b['amount'])});
	return sortable;
};