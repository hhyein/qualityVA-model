import React, { useEffect, useRef } from 'react'

function ECDFchart(props) {
  const { data } = props
  const svgRef = useRef()
  const d3 = window.d3v4

  useEffect(() => {
    d3.select(svgRef.current).selectAll('*').remove()

    var margin = { top: 20, right: 20, bottom: 20, left: 20 },
      width = 400 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom

      var svg = d3
      .select(svgRef.current)
      .append('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var sumstat = d3.nest()
      .key(function(d) { return d.index;})
      .entries(data);

    var x = d3.scaleLinear()
      .domain([d3.min(data, function(d) { return +d.x; }), d3.max(data, function(d) { return +d.x; })])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.y; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    var res = sumstat.map(function(d){ return d.key })
    var color = d3.scaleOrdinal()
      .domain(res)
      .range(["#6a3d9a", "#9e9e9e"]);

    svg.selectAll(".line")
      .data(sumstat)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", function(d){ return color(d.key) })
      .attr("stroke-width", 1.5)
      .attr("d", function(d){
          return d3.line()
              .x(function(d) { return x(d.x); })
              .y(function(d) { return y(+d.y); })
              (d.values)
          })
    }, [props.data]);
    
  return (
    <div className = "svg-wrapper">
      <svg ref = {svgRef}></svg>
    </div>
  );
}

export default ECDFchart