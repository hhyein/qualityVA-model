import React, { useEffect, useRef } from 'react'

function Parallelchart(props) {
  const { data } = props
  const svgRef = useRef()
  const d3 = window.d3v4

  var rows = []
  Object.assign(rows, Object.values(data))

  var columns = []
  Object.assign(columns, Object.keys(data))

  useEffect(() => {
    d3.select(svgRef.current).selectAll('*').remove()

    var margin = { top: 20, right: 20, bottom: 20, left: 20 },
      width = svgRef.current.clientWidth - margin.left - margin.right,
      height = svgRef.current.clientHeight - margin.top - margin.bottom

    var svg = d3
      .select(svgRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var dimensions = d3.keys(data[0]).filter(function(d) { return d != "Species" })

    var y = {}
    for (var i in dimensions) {
      var name = dimensions[i]
      y[name] = d3.scaleLinear()
        .domain( d3.extent(data, function(d) { return +d[name]; }) )
        .range([height, 0])
    }

    var x = d3.scalePoint()
      .range([0, width])
      .padding(1)
      .domain(dimensions);

    function path(d) {
        return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    svg
      .selectAll("myPath")
      .data(data)
      .enter().append("path")
      .attr("d",  path)
      .style("fill", "none")
      .style("stroke", "#69b3a2")
      .style("opacity", 0.5)

    svg.selectAll("myAxis")
      .data(dimensions).enter()
      .append("g")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black")
  }, [props.data])

  return (
    <div className = "svg-wrapper">
      <svg ref = {svgRef}></svg>
    </div>
  )
}
export default Parallelchart
