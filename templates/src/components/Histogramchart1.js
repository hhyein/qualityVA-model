import React, { useEffect, useRef } from 'react'

function Histogramchart1(props) {
  const { data, selectedCharttablePos } = props
  const svgRef = useRef()
  const d3 = window.d3v4

  useEffect(() => {
    var svg = d3.select(svgRef.current)
    d3.select(svgRef.current).selectAll('*').remove()

    var data = []
    var ordinals = []
    
    for(var i = 0; i < 100; i++){
      data.push({
        value: Math.random()*10,
        city: 'test' + i
      })
      ordinals.push('test' + i)
    }
    
    var margin = { top: 20, right: 20, bottom: 20, left: 20 },
      width = 350 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom - 80,
      height2 = 30
    
    svg
      .attr('width', 550)
      .attr('height', 400)
    
    var focus = svg.append('g')
      .attr('class', 'focus')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    
    var context = svg.append('g')
      .attr('class', 'context')
      .attr('transform', 'translate(' + margin.left + ',' + (margin.top + 300) + ')')
    
    var x = d3.scaleLinear().range([0, width])
    var x2 = d3.scaleLinear().range([0, width])
    var y = d3.scaleLinear().range([height, 0])
    var y2 = d3.scaleLinear().range([height2, 0])
    
    var xBand = d3.scaleBand().domain(d3.range(-1, ordinals.length)).range([0, width])
    
    var xAxis = d3.axisBottom(x).tickFormat((d, e) => ordinals[d])
    var xAxis2 = d3.axisBottom(x2)
    var yAxis = d3.axisLeft(y)
    var yAxis2 = d3.axisLeft(y2)
    
    var brush = d3.brushX()
        .extent([[0, 0], [width, height2]])
        .on('brush', brushed)
    
    x.domain([-1, ordinals.length])
    y.domain([0, d3.max(data, d => d.value)])
    x2.domain(x.domain())
    y2.domain([0, d3.max(data, d => d.value)])
    
    focus.append('g')
         .attr('clip-path','url(#my-clip-path)')
         .selectAll('.bar')
         .data(data)
         .enter()
         .append('rect')
         .attr('class', 'bar')
         .attr('x', (d, i) => {
          return x(i) - xBand.bandwidth()*0.9/2
         })
         .attr('y', (d, i) => {
          return y(d.value)
         })
         .attr('width', xBand.bandwidth()*0.9)
         .attr('height', d => {
          return height - y(d.value)
         })
    
    focus.append('g')
          .attr('class', 'axis')
          .attr('transform', 'translate(' + 0 + ',' + height + ')')
          .call(xAxis)
    
    focus.append('g')
          .attr('class', 'axis axis--y')
          .call(yAxis)
    
    var defs = focus.append('defs')
    
    defs.append('clipPath')
        .attr('id', 'my-clip-path')
        .append('rect')
        .attr('width', width)
        .attr('height', height)
    
    context.selectAll('.bar')
         .data(data)
         .enter()
         .append('rect')
         .attr('class', 'bar')
         .attr('x', (d, i) => {
          return x2(i) - xBand.bandwidth()*0.9/2
         })
         .attr('y', (d, i) => y2(d.value))
         .attr('width', xBand.bandwidth()*0.9)
         .attr('height', d => {
          return height2 - y2(d.value)
         })
    
    context.append('g')
          .attr('class', 'axis2')
          .attr('transform', 'translate(' + 0 + ',' + height2 + ')')
          .call(xAxis)
    
    context.append('g')
          .attr('class', 'brush')
          .call(brush)
          .call(brush.move, x.range())
    
    function brushed() {
      var s = d3.event.selection || x2.range()
      console.log(x.invert(s[0]))
      console.log(x.invert(s[1]))

      x.domain(s.map(x2.invert, x2))
      focus.select('.axis').call(xAxis)
      focus.selectAll('.bar')
           .attr('x', (d, i) => {
            return x(i) - xBand.bandwidth()*0.9/2
           })
          }
  }, [props.data])

  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  )
}
export default Histogramchart1
