import React, { useEffect, useRef } from 'react'

function Correlationchart(props) {
  const { data } = props
  const svgRef = useRef()
  const d3 = window.d3v4

  useEffect(() => {
    var margin = { top: 20, right: 20, bottom: 20, left: 20 },
      width = svgRef.current.clientWidth - margin.left - margin.right,
      height = svgRef.current.clientHeight - margin.top - margin.bottom

    d3.select(svgRef.current).selectAll('*').remove()

    var svg = d3
      .select(svgRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    d3.csv(
      'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_correlogram.csv',
      function (error, rows) {
        var data = []
        rows.forEach(function (d) {
          var x = d['']
          delete d['']
          for (var prop in d) {
            var y = prop,
              value = d[prop]
            data.push({
              x: x,
              y: y,
              value: +value,
            })
          }
        })

        var domain = d3
          .set(
            data.map(function (d) {
              return d.x
            })
          )
          .values()
        var num = Math.sqrt(data.length)

        var color = d3
          .scaleLinear()
          .domain([-1, 0, 1])
          .range(['#B22222', '#fff', '#000080'])

        var size = d3.scaleSqrt().domain([0, 1]).range([0, 9])
        var x = d3.scalePoint().range([0, width]).domain(domain)
        var y = d3.scalePoint().range([0, height]).domain(domain)

        var cor = svg
          .selectAll('.cor')
          .data(data)
          .enter()
          .append('g')
          .attr('class', 'cor')
          .attr('transform', function (d) {
            return 'translate(' + x(d.x) + ',' + y(d.y) + ')'
          })

        cor
          .filter(function (d) {
            var ypos = domain.indexOf(d.y)
            var xpos = domain.indexOf(d.x)
            return xpos <= ypos
          })
          .append('text')
          .attr('y', 5)
          .text(function (d) {
            if (d.x === d.y) {
              return d.x
            } else {
              return d.value.toFixed(2)
            }
          })
          .style('font-size', 11)
          .style('text-align', 'center')
          .style('fill', function (d) {
            if (d.x === d.y) {
              return '#000'
            } else {
              return color(d.value)
            }
          })

        cor
          .filter(function (d) {
            var ypos = domain.indexOf(d.y)
            var xpos = domain.indexOf(d.x)
            return xpos > ypos
          })
          .append('circle')
          .attr('r', function (d) {
            return size(Math.abs(d.value))
          })
          .style('fill', function (d) {
            if (d.x === d.y) {
              return '#000'
            } else {
              return color(d.value)
            }
          })
          .style('opacity', 0.8)
      }
    )
  }, [props.data, d3, svgRef])

  return <div className="svg-wrapper" ref={svgRef}></div>
}
export default Correlationchart
