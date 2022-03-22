import React, { useEffect, useRef } from 'react'

function Barchart1(props) {
  const { data } = props
  const svgRef = useRef()
  const d3 = window.d3v4

  useEffect(() => {
    var svg = d3.select(svgRef.current)
    d3.select(svgRef.current).selectAll('*').remove()

    var margin = { top: 20, right: 0, bottom: 0, left: 0 },
      width = 150 - margin.left - margin.right,
      height = 50 - margin.top - margin.bottom

    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var x = d3.scaleLinear().domain([0, 100]).range([0, width])
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))

    var y = d3.scaleBand().range([0, height]).padding(.2)
    svg.append('g').call(d3.axisLeft(y))

    svg
      .selectAll('myRect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', x(0))
      .attr('y', function (d) {
        return y(d.Country)
      })
      .attr('width', function (d) {
        return x(d.Value)
      })
      .attr('height', y.bandwidth())
      .attr('fill', '#69b3a2')
  }, [data, svgRef, d3])

  return (
    <div className="svg-wrapper">
      <svg ref={svgRef}></svg>
    </div>
  )
}
export default Barchart1
