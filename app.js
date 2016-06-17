/*
 * 
 */
(function($){
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});
    var COLORS = ['#F44336', '#E91E63', '#9C27B0', '#3F51B5', '#2196F3', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#795548'];
    var language_list_item_template = new Templater($('#language_list_item_template').html());
    var title_template = new Templater($('#title_template').html());
    var notfound_title_template = new Templater($('#notfound_title_template').html());
    
    $('#username_form').on('submit', function(event) {
        event.preventDefault();
        generateReportButtonAction();
    });

    generateReportButtonAction();

    function generateReportButtonAction(){
        displayUserRepos(document.getElementById('username_input').value);
    }
    
    function displayUserRepos(user){
        var language_list = [];
        $.ajax({url: 'https://api.github.com/users/'+ encodeURI(user) + '/repos?per_page=100',
            success: function(repos){
                if(!repos || repos.length === 0){
                    displayNoResults(user);
                    return;
                }
                $('#title_container').html(title_template.render({user:user}));
                var languages_set = new WDP.countedSet();
                $.each(repos, function(index, repo) {
                    languages_set.add(repo.language);
                });
                language_list = languages_set.getSortedCollection();
                //might have repos, but none have a valid language
                if(language_list.length === 0){
                    displayNoResults(user);
                    return;
                }
                google.charts.setOnLoadCallback(function(){drawReposByLanguageChart(language_list);});
                drawLanguagesBarChart(language_list);
            },
            error: function(){
                displayNoResults(user);
            }
        });
    }

    function displayNoResults(user){
        $('#title_container').html(notfound_title_template.render({user:user}));
        $('#languages_list').html('');
        $('#chart_div').html('');
    }
    
    function drawLanguagesBarChart(language_list){
        var inner_list_fragment = $(document.createDocumentFragment());
        $.each(language_list, function(index, val) {
            var context = {};
            context.name = val.name;
            context.count = val.amount;
            context.percentage = val.percentage_of_max;
            context.color = COLORS[index % COLORS.length];
            inner_list_fragment.append(language_list_item_template.render(context));
        });
        $('#languages_list').html(inner_list_fragment);
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
})(jQuery);