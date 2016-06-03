$(function() {
    
    var graph = LineChart()
                    .indy('year')
                    .y('population');
    
    d3.csv('population.csv', function(data) {
        d3.select('#vis')
            .datum(data)
            .call(graph);
    });
    
});