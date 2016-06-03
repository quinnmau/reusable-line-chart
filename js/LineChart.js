function LineChart() {
    var width = 800;
    var height = 600;
    var x; //required
    var y; //required
    var xScale = d3.scale.linear(); //set domain and range later
    var yScale = d3.scale.linear(); //set domain and range later
    var xAxis = d3.svg.axis();
    var yAxis = d3.svg.axis();
    var xText = 'X Axis';
    var yText = 'Y Axis';
    var color = d3.scale.category10();
    var margin = {
        top: 0,
        left: 75,
        bottom: 50,
        right: 0
    };
    
    function chart(selection) {
        //chart dimensions
        var innerHeight = height - margin.top - margin.bottom;
        var innerWidth = width - margin.left - margin.right;
        
        //loop through selection and data bound to each element
        selection.each(function(data) {
            console.log(data);
            
            //line 
            var line = d3.svg.line()
                        .interpolate('basis')
                        .x(function(d) {console.log(d); return xScale(+d.xval)})
                        .y(function(d) {return yScale(+d.yval)});
            
            color.domain(d3.keys(data[0]).filter(function(key) {return key !== x;}));
            var deps = color.domain().map(function(name) {
                return {
                    name: name,
                    values: data.map(function(d) {
                        return {xval: +d[x], yval: +d[name]};
                    })
                };
            });
            
            console.log(deps);
            
            //selected element
            var div = d3.select(this);
            
            //svg to work with and bind data (only gets appended once)
            var svg = div.selectAll('svg').data([data]);
            
            //g to hold graphics (axis labels etc.)
            var gEnter = svg.enter().append('svg')
                            .attr('width', width)
                            .attr('height', height)
                            .append('g');
            
            //g to hold paths               
            gEnter.append('g')
                            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
                            .attr('width', innerWidth)
                            .attr('height', innerHeight)
                            .attr('class', 'gEnter');
            //x axis               
            gEnter.append('g')
                    .attr('class', 'xaxis axis');
                    
            //y axis
            gEnter.append('g')
                    .attr('class', 'yaxis axis');
            
            //x axis label        
            gEnter.append('text')
                    .attr('class', 'xtitle title');
                    
            //y axis label
            gEnter.append('text')
                    .attr('class', 'ytitle title');
                    
            //set scales
            xScale.domain(d3.extent(data, function(d) {return d[x]})).range([0, innerWidth]);
            console.log(xScale.domain());
            
            var yMin = d3.min(deps, function(c) {return d3.min(c.values, function(v) {return v.yval})});
            var yMax = d3.max(deps, function(c) {return d3.max(c.values, function(v) {return v.yval})});
            yScale.domain([yMin, yMax]).range([innerHeight, 0]);
            
            //set call and update axes position       
            xAxis.scale(xScale).orient('bottom');
            yAxis.scale(yScale).orient('left');
            
            //x
            svg.select('.xaxis')
                    .attr('transform', 'translate(' + margin.left + ', ' + (innerHeight + margin.top) + ')')
                    .transition()
                    .duration(1000)
                    .call(xAxis);
                    
            //y
            svg.select('.yaxis')
                    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
                    .transition()
                    .duration(1000)
                    .call(yAxis);
                    
            //x text
            svg.select('.xtitle')
                    .attr('transform', 'translate(' + (margin.left + innerWidth / 2) + ', ' + (margin.top + innerHeight + 40) + ')')
                    .transition()
                    .duration(0)
                    .text(xText);
                    
            //y text
            svg.select('.ytitle')
                    .attr('transform', 'translate(' + (margin.left - 40) + ', ' + (margin.top + innerHeight / 2) + ') rotate(-90)')
                    .transition()
                    .duration(0)
                    .text(yText);
                  
            //re select gEnter to append shapes
            var g = div.select('.gEnter');
            
            var paths = g.selectAll('.a-path').data(deps);
                    
            paths.enter().append('path')
                    .attr('class', 'a-path')
                    .attr('d', function(d) {console.log(d.values); return line(d.values)})
                    .style('stroke', function(d) {return color(d.name)});
                    
            paths.exit().transition().duration(500).remove();
            
            paths.transition().duration(500)
                    .attr('d', function(d) {console.log(d.values); return line(d.values)});
        });
    }
    
    /*-------- getter/setter methods --------*/
    
    // get/set value for x axis
    chart.indy = function(val) {
        if(!arguments.length) {
            return x;
        }
        x = val;
        return chart;
    };
    
    // get/set name of value to use for y
    chart.y = function(val) {
        if(!arguments.length) {
            return y;
        }
        y = val;
        return chart;
    }
    
    // get/set width of chart
    chart.width = function(val) {
        if (!arguments.length) {
            return width;
        }
        width = val;
        return chart;
    };
    
    // get/set height of chart
    chart.height = function(val) {
        if (!arguments.length) {
            return height;
        }
        height = val;
        return chart;
    };
    
    return chart;
}