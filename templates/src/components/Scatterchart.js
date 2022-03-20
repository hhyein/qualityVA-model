import React, { useState, useEffect, useRef } from 'react'

function Scatterchart(props) {
  const { data } = props
  const svgRef = useRef()
  const d3 = window.d3v4

  const [clicked, setClicked] = useState(false)
  const [X, setX] = useState([])
  const [Y, setY] = useState([])

  useEffect(() => {
    var svg = d3.select(svgRef.current)
    d3.select(svgRef.current).selectAll('*').remove()

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = svgRef.current.clientWidth - margin.left - margin.right,
      height = svgRef.current.clientHeight - margin.top - margin.bottom

    // append the svg object to the body of the page
    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    //Read the data
    d3.csv(
      'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv',
      function (data) {
        // Add X axis
        var x = d3.scaleLinear().domain([4, 8]).range([0, width])
        svg
          .append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .call(d3.axisBottom(x))

        // Add Y axis
        var y = d3.scaleLinear().domain([0, 9]).range([height, 0])
        svg.append('g').call(d3.axisLeft(y))

        // Color scale: give me a specie name, I return a color
        var color = d3
          .scaleOrdinal()
          .domain(['setosa', 'versicolor', 'virginica'])
          .range(['#440154ff', '#21908dff', '#fde725ff'])

        // Add dots
        svg
          .append('g')
          .selectAll('dot')
          .data(data)
          .enter()
          .append('circle')
          .attr('cx', function (d) {
            return x(d.Sepal_Length)
          })
          .attr('cy', function (d) {
            return y(d.Petal_Length)
          })
          .attr('r', 3)
          .style('fill', function (d) {
            return color(d.Species)
          })

        d3.selectAll('svg').on('click', function (d, i) {
          d3.event.preventDefault()
          setClicked(false)
        })

        d3.selectAll('circle').on('contextmenu', function (d, i) {
          d3.event.preventDefault()
          setClicked(true)
          setX(d3.event.layerX)
          setY(d3.event.layerY)
        })

        svg.append("circle").attr("cx", 330).attr("cy", 30).attr("r", 6).style("fill", "#440154ff")
        svg.append("text").attr("x", 340).attr("y", 30).text("setosa").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("circle").attr("cx", 330).attr("cy", 50).attr("r", 6).style("fill", "#21908dff")
        svg.append("text").attr("x", 340).attr("y", 50).text("versicolor").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("circle").attr("cx", 330).attr("cy", 70).attr("r", 6).style("fill", "#fde725ff")
        svg.append("text").attr("x", 340).attr("y", 70).text("virginica").style("font-size", "15px").attr("alignment-baseline","middle")
      }
    )
  }, [props.data, d3, svgRef])

  return (
    <div className="svg-wrapper">
      <svg ref={svgRef}> </svg>
      {clicked && (
        <div
          className="contextMenu"
          style={{ position: 'absolute', left: X, top: Y }}
        >
          <div className="contextMenu--option">Remove</div>
          <div className="contextMenu--separator" />
          <div className="contextMenu--option">Change</div>
          <div className="contextMenu--separator" />
          <div className="contextMenu--option">Create</div>
        </div>
      )}
    </div>
  )
}
export default Scatterchart
