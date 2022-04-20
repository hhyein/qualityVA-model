import React, { useEffect, useRef } from 'react'

function Barchart2(props) {
  const { data, dataClassList, dataColorCode } = props
  const svgRef = useRef()
  const d3 = window.d3v4
  
  useEffect(() => {
    var svg = d3.select(svgRef.current)
    d3.select(svgRef.current).selectAll('*').remove()

    var margin = { top: 10, right: 0, bottom: 10, left: 0 },
      width = 275 - margin.left - margin.right,
      height = 80 - margin.top - margin.bottom

    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(data.map(function(d) { return d.class; }))
      .padding(0.5)
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
      .domain([0, 100])
      .range([ height, 0]);
     
    var color = d3.scaleOrdinal()
      .domain(dataClassList)
      .range(dataColorCode)  

    svg.selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.class); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.class); })

    svg.selectAll("mybar")
      .data(data)
      .enter()
      .append('g')
      .append('text')
      .attr('x', function(d) { return x(d.class) + x.bandwidth()/2 })
      .attr('y', function(d) { return y(d.value) - 5 })
      .text(function (d) { return d.value })
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px');

  }, [props.data])

  return (
    <>
      <svg ref = {svgRef}>
      </svg>
    </>
  )
}
export default Barchart2
