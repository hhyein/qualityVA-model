import React, { useEffect, useRef } from 'react'

function Boxchart1(props) {
  const {data} = props
  const svgRef = useRef()
  const d3 = window.d3v4

  var df = []
  Object.assign(df, data[0].Value)

  useEffect(() => {
    var svg = d3.select(svgRef.current);
    d3.select(svgRef.current).selectAll("*").remove();

    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
      width = 150 - margin.left - margin.right,
      height = 50 - margin.top - margin.bottom

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var data_sorted = df.sort(d3.ascending)
    var q1 = d3.quantile(data_sorted, .25)
    var median = d3.quantile(data_sorted, .5)
    var q3 = d3.quantile(data_sorted, .75)
    var interQuantileRange = q3 - q1
    var min = q1 - 1.5 * interQuantileRange
    var max = q1 + 1.5 * interQuantileRange

    var x = d3.scaleLinear()
      .domain([min, max])
      .range([0, width])
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))

    var y = d3.scaleBand()
      .range([0, height])
    svg.append('g')
      .call(d3.axisLeft(y))

    var height = 20
    var center = 15

    svg
    .append("line")
    .attr("x1", x(min) )
    .attr("x2", x(max) )
    .attr("y1", center )
    .attr("y2", center )
    .attr("stroke", "black")

    svg
    .append("rect")
    .attr("x", x(q1) )
    .attr("y", center - height/2 )
    .attr("height", height )
    .attr("width", (x(q3) - x(q1)) )
    .attr("stroke", "black")
    .style("fill", "#69b3a2")

    svg
    .selectAll("toto")
    .data([min, median, max])
    .enter()
    .append("line")
    .attr("x1", function(d){ return(x(d))} )
    .attr("x2", function(d){ return(x(d))} )
    .attr("y1", center-height/2 )
    .attr("y2", center+height/2 )
    .attr("stroke", "black")
    }, [props.data]);
    
  return (
    <>
      <svg ref = {svgRef}>
      </svg>
    </>
  );
}
export default Boxchart1
