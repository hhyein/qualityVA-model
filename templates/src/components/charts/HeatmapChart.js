import React, { useEffect, useRef } from 'react'

export default function HeatmapChart({
  data,
  dataHeatmapChartYList,
  dataColumnList,
  colorCode = 'steelblue',
  onHeatmapCellClick,
}) {
  const svgRef = useRef()
  const d3 = window.d3v4

  useEffect(() => {
    if (!data) {
      return
    }
    var svg = d3.select(svgRef.current)
    d3.select(svgRef.current).selectAll('*').remove()

    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
      width = svgRef.current.clientWidth - margin.left - margin.right,
      height = svgRef.current.clientHeight - margin.top - margin.bottom

    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var x = d3
      .scaleBand()
      .range([0, width])
      .domain(dataColumnList)
      .padding(0.1)

    var y = d3
      .scaleBand()
      .range([height, 0])
      .domain(dataHeatmapChartYList)
      .padding(0.1)
      
    var color1 = d3.scaleLinear().range(['white', '#cccccc']).domain([0, 100])
    var color2 = d3.scaleLinear().range(['white', colorCode]).domain([0, 100])

    var mouseover = function (d) {
      d3.select(this)
        .style('stroke', '#999999')
        .style('stroke-width', '2px')
        .style('opacity', 1)
    }
    var mouseleave = function (d) {
      d3.select(this)
        .style('stroke', 'none')
        .style('opacity', 0.8)
    }

    svg
      .selectAll()
      .data(data, function (d) {
        return d.index + ':' + d.y
      })
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return x(d.index)
      })
      .attr('y', function (d) {
        return y(d.y)
      })
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', function (d) {
        if (d.value == 0) {
          return color1(35)
        }
        return color2(d.value * 15)
      })
      .style('stroke-width', 4)
      .style('stroke', 'none')
      .style('opacity', 0.8)
      .on('mouseover', mouseover)
      .on('mouseleave', mouseleave)
      .on('click', function (d) {
        onHeatmapCellClick(d)
      })
  }, [
    data,
    dataHeatmapChartYList,
    dataColumnList,
    colorCode,
    d3,
    onHeatmapCellClick,
  ])

  return <svg ref={svgRef} style={{ width: '100%', height: '30%' }}></svg>
}
