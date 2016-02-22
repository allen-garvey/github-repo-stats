/*
 * 
 */
(function($){
	var languages_set = new WDP.countedSet();
    $.get('https://api.github.com/users/allen-garvey/repos', function(repos) {
    	$.each(repos, function(index, repo) {
    		 languages_set.add(repo.language);
    	});
    	var language_collection = languages_set.getSortedCollection();
    	var $languages_list = $('#languages_list');
    	$.each(language_collection, function(index, val) {
    		 var text = val.name + ' ' + val.amount;
    		 console.log(text);
    		 $languages_list.append('<li>' + text + '</li>');
    	});
    });
})(jQuery);