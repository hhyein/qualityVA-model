import React, { useEffect, useRef } from 'react'

function Barchart2(props) {
  const { data } = props
  const svgRef = useRef()
  const d3 = window.d3v4

  var subgroups = {}
  Object.assign(subgroups, data[0])
  subgroups = Object.keys(subgroups)
  for(var i = 0; i < subgroups.length; i++) {
    if(subgroups[i] === 'group')  {
      subgroups.splice(i, 1);
      i--;
    }
  }

  useEffect(() => {
    var svg = d3.select(svgRef.current)
    d3.select(svgRef.current).selectAll('*').remove()

    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
      width = 150 - margin.left - margin.right,
      height = 50 - margin.top - margin.bottom

    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width])
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))

    var y = d3.scaleBand()
      .range([0, height])
    svg.append('g')
      .call(d3.axisLeft(y))

    var color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(['#e41a1c', '#377eb8', '#4daf4a'])

    data.forEach(function (d) {
      var tot = 0
      for (var i in subgroups) {
        var name = subgroups[i]
        tot += +d[name]
      }
      for (var i in subgroups) {
        var name = subgroups[i]
        d[name] = (d[name] / tot) * 100
      }
    })

    var stackedData = d3.stack().keys(subgroups)(data)

    svg
      .append('g')
      .selectAll('g')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('fill', function (d) {
        return color(d.key)
      })
      .selectAll('rect')
      .data(function (d) {
        return d
      })
      .enter()
      .append('rect')
      .attr('y', function (d) {
        return y(d.data.group)
      })
      .attr('x', function (d) {
        return x(d[0])
      })
      .attr('width', function (d) {
        return x(d[1]) - x(d[0])
      })
      .attr('height', y.bandwidth())
  }, [props.data])

  return (
    <>
      <svg ref = {svgRef}>
      </svg>
    </>
  )
}
export default Barchart2
