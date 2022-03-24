import React, { useEffect, useRef } from 'react'

function Boxchart1(props) {
  const {data} = props
  const svgRef = useRef()
  const d3 = window.d3v4

  useEffect(() => {
    var svg = d3.select(svgRef.current);
    d3.select(svgRef.current).selectAll("*").remove();

    var margin = {top: 10, right: 30, bottom: 30, left: 40},
      width = 200 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var data = [12,19,11,13,12,22,13,4,15,16,18,19,20,12,11,9]

    var data_sorted = data.sort(d3.ascending)
    var q1 = d3.quantile(data_sorted, .25)
    var median = d3.quantile(data_sorted, .5)
    var q3 = d3.quantile(data_sorted, .75)
    var interQuantileRange = q3 - q1
    var min = q1 - 1.5 * interQuantileRange
    var max = q1 + 1.5 * interQuantileRange

    var y = d3.scaleLinear()
      .domain([0,24])
      .range([height, 0]);
    svg.call(d3.axisLeft(y))

    var center = 100
    var width = 100

    svg
    .append("line")
    .attr("x1", center)
    .attr("x2", center)
    .attr("y1", y(min) )
    .attr("y2", y(max) )
    .attr("stroke", "black")

    svg
    .append("rect")
    .attr("x", center - width/2)
    .attr("y", y(q3) )
    .attr("height", (y(q1)-y(q3)) )
    .attr("width", width )
    .attr("stroke", "black")
    .style("fill", "#69b3a2")

    svg
    .selectAll("toto")
    .data([min, median, max])
    .enter()
    .append("line")
    .attr("x1", center-width/2)
    .attr("x2", center+width/2)
    .attr("y1", function(d){ return(y(d))} )
    .attr("y2", function(d){ return(y(d))} )
    .attr("stroke", "black")
    }, [props.data]);
    
  return (
    <div className = "svg-wrapper">
      <svg ref = {svgRef}></svg>
    </div>
  );
}
export default Boxchart1
