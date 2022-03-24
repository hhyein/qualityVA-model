import React, { useEffect, useRef } from 'react'

function Treechart() {
  const svgRef = useRef()
  const d3 = window.d3v3

  useEffect(() => {
    var data = [
      {
        name: 'EM',
        parent: 'null',
        children: [
          {
            name: 'Mean',
            parent: 'EM',
            children: [
              {
                name: 'Mode',
                parent: 'Mean',
              },
            ],
          },
        ],
      },
    ]

    var margin = { top: 0, right: 0, bottom: 0, left: 100 },
      width = svgRef.current.clientWidth - margin.right - margin.left,
      height = svgRef.current.clientHeight - margin.top - margin.bottom

    var i = 0

    d3.select(svgRef.current).selectAll('*').remove()

    var svg = d3
      .select(svgRef.current)
      .append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var tree = d3.layout.tree().size([height, width])

    var diagonal = d3.svg.diagonal().projection(function (d) {
      return [d.y, d.x]
    })

    var root = data[0]
    update(root)

    function update(source) {
      var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes)

      nodes.forEach(function (d) {
        d.y = d.depth * 180
      })

      var node = svg.selectAll('g.node').data(nodes, function (d) {
        return d.id || (d.id = ++i)
      })

      var nodeEnter = node
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', function (d) {
          return 'translate(' + d.y + ',' + d.x + ')'
        })

      nodeEnter.append('circle').attr('r', 10).style('fill', '#fff')

      nodeEnter
        .append('text')
        .attr('x', function (d) {
          return d.children || d._children ? -13 : 13
        })
        .attr('dy', '.35em')
        .attr('text-anchor', function (d) {
          return d.children || d._children ? 'end' : 'start'
        })
        .text(function (d) {
          return d.name
        })
        .style('fill-opacity', 1)

      var link = svg.selectAll('path.link').data(links, function (d) {
        return d.target.id
      })

      link.enter().insert('path', 'g').attr('class', 'link').attr('d', diagonal)
    }
  }, [])

  return (
    <div className = "svg-wrapper">
      <svg ref = {svgRef}></svg>
    </div>
  )
}
export default Treechart
