import React, { useEffect, useRef } from 'react'

function VerticalTreeChart(props) {
  const { data } = props
  const svgRef = useRef()
  const d3 = window.d3v3

  useEffect(() => {
    var svg = d3.select(svgRef.current);
    d3.select(svgRef.current).selectAll("*").remove();
    
    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
      width = 30 - margin.right - margin.left,
      height = 200 - margin.top - margin.bottom

    var i = 0

    svg
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var tree = d3.layout.tree().size([height, width])
    var diagonal = d3.svg.diagonal().projection(function (d) {
      return [d.x, d.y]
    })

    var root = data[0]
    update(root)

    function update() {
      var nodes = tree.nodes(root).reverse()
      var links = tree.links(nodes)

      nodes.forEach(function (d) {
        d.x = 30
        d.y = d.depth * 60
      })

      var node = svg
        .selectAll('g.node')
        .data(nodes, function (d) {
        return d.id || (d.id = ++i)
      })

      var nodeEnter = node
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', function (d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })

      nodeEnter
        .append('circle')
        .attr('r', 10)
        .style('fill', function (d) {
          if (d.state == 'current') {
            return '#999999'
          }
          else {
            return '#cccccc'
          }
        })

      nodeEnter
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text(function (d) {
          return d.index
        })

      var link = svg
        .selectAll('path.link')
        .data(links)
        .enter()
        .insert('path', 'g')
        .attr('class', 'link')
        .attr('d', diagonal)
    }
  }, [props.data])

  return (
    <div className = "svg-wrapper">
      <svg ref = {svgRef}></svg>
    </div>
  )
}
export default VerticalTreeChart