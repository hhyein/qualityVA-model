import React, { useEffect, useRef } from 'react'

function Barchart2(props) {
  const { data } = props
  const svgRef = useRef()
  const d3 = window.d3v4

  useEffect(() => {
    var svg = d3.select(svgRef.current)
    d3.select(svgRef.current).selectAll('*').remove()

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 20, left: 50 },
      width = svgRef.current.clientWidth - margin.left - margin.right,
      height = svgRef.current.clientHeight - margin.top - margin.bottom

    // append the svg object to the body of the page
    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var subgroups = ['Nitrogen', 'normal', 'stress']
    var groups = ['banana', 'poacee', 'sorgho', 'triticum']

    // Add X axis
    var x = d3.scaleLinear().domain([0, 100]).range([0, width])
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))

    // Add Y axis
    var y = d3.scaleBand().range([0, height]).padding(0.2)
    svg.append('g').call(d3.axisLeft(y))

    // color palette = one color per subgroup
    var color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(['#e41a1c', '#377eb8', '#4daf4a'])

    // Normalize the data -> sum of each group must be 100!
    var dataNormalized = []
    data.forEach(function (d) {
      // Compute the total
      var tot = 0
      for (var i in subgroups) {
        var name = subgroups[i]
        tot += +d[name]
      }
      // Now normalize
      for (var i in subgroups) {
        var name = subgroups[i]
        d[name] = (d[name] / tot) * 100
      }
    })

    //stack the data? --> stack per subgroup
    var stackedData = d3.stack().keys(subgroups)(data)

    // Show the bars
    svg
      .append('g')
      .selectAll('g')
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .enter()
      .append('g')
      .attr('fill', function (d) {
        return color(d.key)
      })
      .selectAll('rect')
      // enter a second time = loop subgroup per subgroup to add all rectangles
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
  }, [data, d3, svgRef])

  return (
    <div className="chart-wrapper">
      <svg ref={svgRef}></svg>
    </div>
  )
}
export default Barchart2
