/*
 * 
 */
(function($, _){
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});
    var COLORS = ['#F44336', '#E91E63', '#9C27B0', '#3F51B5', '#2196F3', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#795548'];
    var language_list_item_template = _.template($('#language_list_item_template').html());
    var title_template = _.template($('#title_template').html());
    
    $('#username_form').on('submit', function(event) {
        event.preventDefault();
        generateReportButtonAction();
    });
    
    generateReportButtonAction();

    function generateReportButtonAction(){
        displayUserRepos($('#username_input').val());
    }
    
    function displayUserRepos(user){
        var language_list = [];
        $.get('https://api.github.com/users/'+ encodeURI(user) + '/repos?per_page=100')
        .done(function(repos){
            $('#title_container').html(title_template({user:user}));
            var languages_set = new WDP.countedSet();
            $.each(repos, function(index, repo) {
                languages_set.add(repo.language);
            });
            language_list = languages_set.getSortedCollection();
        })
        .done(function(){
            google.charts.setOnLoadCallback(function(){drawReposByLanguageChart(language_list);});
        })
        .done(function(){
            drawLanguagesBarChart(language_list);
        });
    }

    
    function drawLanguagesBarChart(language_list){
        var $languages_list = $('#languages_list');
        $languages_list.html('');
        $.each(language_list, function(index, val) {
            var variables = {};
            variables.title = val.name + ' - ' + val.amount;
            variables.percentage = val.percentage_of_max;
            variables.color = COLORS[index % COLORS.length];
            $languages_list.append(language_list_item_template(variables));
        });
    };

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
                        'fontName' : "Avenir, 'Noto Sans', 'Century Gothic', 'Helvetica Neue', Helvetica, Arial, sans-serif;",
                        'fontSize' : 16,
                        'colors': COLORS
                   };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
})(jQuery, _);