import React, { useEffect, useRef } from 'react';

function Barchart(props) {
  const {data, color, selectedColumn} = props;
  console.log(data);

  const svgRef = useRef();
  const d3 = window.d3v4;

  useEffect(() => {
    var svg = d3.select(svgRef.current);
    d3.select(svgRef.current).selectAll("*").remove();

    var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 400 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
    .range([ 0, width - 150])
    .domain(data.map(function(d) { return d.index; }))
    .padding(0.5);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("text");

    var max_value = d3.max(data, function(d) { return d[selectedColumn]; });

    var y = d3.scaleLinear()
        .domain([0, max_value])
        .range([ height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll()
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.index); })
        .attr("y", function(d) { return y(d[selectedColumn]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d[selectedColumn]); })
        .attr("fill", color)
    }, [color, selectedColumn, props.data]);


    
  return (
    <>
      <svg ref={svgRef}>
      </svg>
    </>
  );
}
export default Barchart;