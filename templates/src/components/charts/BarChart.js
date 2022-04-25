import React, { useEffect, useRef } from 'react'

function BarChart(props) {
  const { data } = props
  const svgRef = useRef()
  const d3 = window.d3v4

  useEffect(() => {
    if (!data) {
      return
    }

    var svg = d3.select(svgRef.current)
    d3.select(svgRef.current).selectAll('*').remove()

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = 100 - margin.left - margin.right,
      height = 50 - margin.top - margin.bottom;

    svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    var subgroups = ['missing', 'outlier', 'incons']
    var groups = ['data']

    var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll("text")
      .remove()

    var y = d3.scaleLinear()
      .domain([0, 40])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    var xSubgroup = d3.scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.05])

    var color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(['steelblue','orange','darkgreen'])

    svg.append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.group) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
      .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.key); });
  }, [data])

  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  )
}
export default BarChart
