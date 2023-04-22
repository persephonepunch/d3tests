var data = [
    { "date": "2016-10-11", "value": 51 },
    { "date": "2016-10-12", "value": 59 },
    { "date": "2016-10-13", "value": 70 },
    { "date": "2016-10-15", "value": 87 }, 
    { "date": "2016-10-17", "value": 99 },
    { "date": "2016-10-18", "value": 58 }, 
    { "date": "2016-10-20", "value": 59 },
    { "date": "2016-10-21", "value": 60 },
    { "date": "2016-10-22", "value": 89 },  
    { "date": "2016-10-25", "value": 90 },  
    { "date": "2016-10-27", "value": 58 },
    { "date": "2016-10-28", "value": 53 },  
    { "date": "2016-11-01", "value": 67 }, 
    { "date": "2016-11-02", "value": 70 }, 
    { "date": "2016-11-03", "value": 90 },
    { "date": "2016-11-04", "value": 13 },
    { "date": "2016-11-06", "value": 53 }
  ];
  
  // If data is not available
  if( typeof data === "undefined" ){
    
    // Output error
    $( "#graph" ).text( "No Data Available." );
    
  // Otherwise
  } else {
    
// set the dimensions and margins of the graph
var margin = {top: 100, right: 80, bottom: 100, left: 60},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;
  
  // Parse dates
  var parseTime = d3.timeParse("%Y-%m-%d"),
      formatTime = d3.timeFormat("%b %e");
  
  // Setup ranges
  var x = d3.scaleTime().range( [ 0, width ] ),
      y = d3.scaleLinear().range( [ height, 0 ] );
  
  // Setup line
  var valueline = d3.line()
      .x( function( d ){ return x( d.date ); } )
      .y( function( d ){ return y( d.value ); } );
  
  // Setup tooltips
  var div = d3.select( "#graph" ).append( "div" )
      .attr( "class", "tooltip" )
      .style( "opacity", 0 );
  
  // Append SVG to container DIV, append group to SVG
  var svg = d3.select( "#graph" ).append( "svg" )
      .attr( "width", width + margin.left + margin.right )
      .attr( "height", height + margin.top + margin.bottom )
    .append( "g" )
      .attr( "transform",
            "translate( " + margin.left + ", " + margin.top + " )" );
  
    // Format the data
    data.forEach( function( d ){
        d.date = parseTime( d.date );
        d.value = +d.value;
    } );
    
    //---
    
    // get the min/max dates
    var extent = d3.extent(data, function(d) { return d.date; }),
  
        // hash the existing days for easy lookup
        dateHash = data.reduce(function(agg, d) {
            agg[d.date] = true;
            return agg;
        }, {});
  
      // make even intervals
      d3.timeDays(extent[0], extent[1])
          // drop the existing ones
          .filter(function(date) {
              return !dateHash[date];
          })
          // and push them into the array
          .forEach(function(date) {
              var emptyRow = { date: date, value: 0 };
              data.push(emptyRow);
          });
      // re-sort the data
      data.sort(function(a, b) { return d3.ascending(a.date, b.date); });
    
    //---
  
    // Scale the ranges
    x.domain( d3.extent( data, function( d ){ return d.date; } ) );
    y.domain( [ 0, d3.max( data, function( d ){ return d.value; } ) ] );
  
    // Append the line to the graph
    svg.append( "path" )
       .data( [ data ] )
       .attr( "class", "line" )
       .attr( "d", valueline );  
    
    // Append tooltips to the graph
    svg.selectAll( "dot" )
       .data( data )
     .enter().append( "circle" )
       .attr( "class", "node" )
       .attr( "r", 5 )
       .attr( "cx", function( d ){ return x( d.date ); } )
       .attr( "cy", function( d ){ return y( d.value ); } )
      .on( "mouseover", function( d ){
          div.transition()
            .duration( 200 )
            .style( "opacity", 1 );
          div.html( formatTime( d.date) + "<br/>" + d.value )
      } )
      .on( "mousemove", function(){
          return div
              .style( "top", ( d3.event.pageY + 16 ) + "px" )
              .style( "left", ( d3.event.pageX + 16 ) + "px" );
      } )
      .on( "mouseout", function(){
      div.transition()
           .duration( 200 )
           .style( "opacity", 0 );
      } );
    
    // Append X Axis to the graph
    svg.append( "g" )
        .attr( "transform", "translate( 0," + height + " )" )
        .call( d3.axisBottom( x ) );
  
    // Append Y Axis to the graph
    svg.append( "g" )
        .call( d3.axisLeft( y ) );
    
  }