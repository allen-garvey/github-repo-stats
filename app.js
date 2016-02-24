/*
 * 
 */
(function($){
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});
	var languages_set = new WDP.countedSet();
    var language_list = [];
    $.get('https://api.github.com/users/allen-garvey/repos?per_page=100', function(repos) {
    	$.each(repos, function(index, repo) {
    		 languages_set.add(repo.language);
    	});
    	language_list = languages_set.getSortedCollection();
        // Set a callback to run when the Google Visualization API is loaded.
        //because language list is initialized now
        google.charts.setOnLoadCallback(drawChart);

        var $languages_list = $('#languages_list');
    	$.each(language_list, function(index, val) {
    		 var text = val.name + ' - ' + val.amount;
    		 console.log(text);
    		 $languages_list.append('<li><span class="list_text">' + text + '</span><div class="bar" style="width:' +  val.percentage_of_max + '%"></div></li>');
    	});
    });




      

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {

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
                        'colors': ['#E51707', '#A3C6DF', '#471267', '#0064A6', '#210047', '#D9D9D9']
                   };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
})(jQuery);