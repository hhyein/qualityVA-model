import React, { useEffect, useRef } from 'react';

function Linechart(props) {
  const {data} = props;
  console.log(data);

  const svgRef = useRef();
  const d3 = window.d3v4;

  useEffect(() => {
    var svg = d3.select(svgRef.current);
    d3.select(svgRef.current).selectAll("*").remove();

    var margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var sumstat = d3.nest()
      .key(function(d) { return d.date;})
      .entries(data);

    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(5));

    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.unemployed; })*5])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    var res = sumstat.map(function(d){ return d.key })
    var color = d3.scaleOrdinal()
      .domain(res)
      .range(['#e41a1c','#377eb8','#4daf4a'])

    svg
      .selectAll(".line")
      .data(sumstat)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", function(d){ return color(d.key) })
      .attr("stroke-width", 1.5)
      .attr("d", function(d){
        return d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(+d.unemployed); })
          (d.values)
      })
    }, [props.data]);

  return (
    <>
      <svg ref={svgRef}>
      </svg>
    </>
  );
}
export default Linechart;