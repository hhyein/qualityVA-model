import React, { useEffect, useRef } from 'react';

function Scatterchart(props) {
  const {data} = props;
  console.log(data);

  const svgRef = useRef();
  const d3 = window.d3v4;

  useEffect(() => {
    var svg = d3.select(svgRef.current);
    d3.select(svgRef.current).selectAll("*").remove();

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 200 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", function(data) {

      // Add X axis
      var x = d3.scaleLinear()
        .domain([4, 8])
        .range([ 0, width ]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, 9])
        .range([ height, 0]);
      svg.append("g")
        .call(d3.axisLeft(y));

      // Color scale: give me a specie name, I return a color
      var color = d3.scaleOrdinal()
        .domain(["setosa", "versicolor", "virginica" ])
        .range([ "#440154ff", "#21908dff", "#fde725ff"])

      // Add dots
      svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", function (d) { return x(d.Sepal_Length); } )
          .attr("cy", function (d) { return y(d.Petal_Length); } )
          .attr("r", 3)
          .style("fill", function (d) { return color(d.Species) } )

    })

    }, [props.data]);
    
  return (
    <>
      <svg ref={svgRef}>
      </svg>
    </>
  );
}
export default Scatterchart;