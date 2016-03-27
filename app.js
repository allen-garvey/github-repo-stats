/*
 * 
 */
(function($, _){
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});
	var languages_set = new WDP.countedSet();
    var language_list = [];
    var COLORS = ['#F44336', '#E91E63', '#9C27B0', '#3F51B5', '#2196F3', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#795548'];
    var language_list_item_template = _.template($('#language_list_item_template').html());
    $.get('https://api.github.com/users/allen-garvey/repos?per_page=100', function(repos) {
    	$.each(repos, function(index, repo) {
    		 languages_set.add(repo.language);
    	});
    	language_list = languages_set.getSortedCollection();
        // Set a callback to run when the Google Visualization API is loaded.
        //because language list is initialized now
        google.charts.setOnLoadCallback(function(){drawReposByLanguageChart(language_list);});

        var $languages_list = $('#languages_list');
    	$.each(language_list, function(index, val) {
            var variables = {};
    		variables.title = val.name + ' - ' + val.amount;
            variables.percentage = val.percentage_of_max;
            $languages_list.append(language_list_item_template(variables));
    	});
    });

      

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawReposByLanguageChart(language_list) {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Language');
        data.addColumn('number', 'Repo count');
        data.addRows(language_list.map(function(elem) {
                            return [elem.name, elem.amount];
                    })
        );

        // Set chart options
        var options = {'title':'Repos by language',
                       'width':'100%',
                        'height':500,
                        'colors': COLORS
                   };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
})(jQuery, _);