import React, { useEffect, useRef } from 'react'

function Boxchart2(props) {
  const {data} = props
  const svgRef = useRef()
  const d3 = window.d3v4

  useEffect(() => {
    var svg = d3.select(svgRef.current);
    d3.select(svgRef.current).selectAll("*").remove();

    var margin = {top: 10, right: 30, bottom: 30, left: 40},
      width = 300 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", function(data) {
      var sumstat = d3.nest()
        .key(function(d) { return d.Species;})
        .rollup(function(d) {
          var q1 = d3.quantile(d.map(function(g) { return g.Sepal_Length;}).sort(d3.ascending),.25)
          var median = d3.quantile(d.map(function(g) { return g.Sepal_Length;}).sort(d3.ascending),.5)
          var q3 = d3.quantile(d.map(function(g) { return g.Sepal_Length;}).sort(d3.ascending),.75)
          var interQuantileRange = q3 - q1
          var min = q1 - 1.5 * interQuantileRange
          var max = q3 + 1.5 * interQuantileRange
          return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        })
        .entries(data)

      var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(["setosa", "versicolor", "virginica"])
        .paddingInner(1)
        .paddingOuter(.5)
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

      var y = d3.scaleLinear()
        .domain([3,9])
        .range([height, 0])
      svg.append("g").call(d3.axisLeft(y))

      svg
        .selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function(d){return(x(d.key))})
        .attr("x2", function(d){return(x(d.key))})
        .attr("y1", function(d){return(y(d.value.min))})
        .attr("y2", function(d){return(y(d.value.max))})
        .attr("stroke", "black")
        .style("width", 40)

      var boxWidth = 100
      svg
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
            .attr("x", function(d){return(x(d.key)-boxWidth/2)})
            .attr("y", function(d){return(y(d.value.q3))})
            .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
            .attr("width", boxWidth )
            .attr("stroke", "black")
            .style("fill", "#69b3a2")

      svg
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
        .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
        .attr("y1", function(d){return(y(d.value.median))})
        .attr("y2", function(d){return(y(d.value.median))})
        .attr("stroke", "black")
        .style("width", 80)
    })
    }, [props.data]);
    
  return (
    <>
      <svg ref = {svgRef}>
      </svg>
    </>
  );
}
export default Boxchart2
