import React, { useEffect, useRef } from "react"

export default function HistogramChart(props) {
  const { data } = props
  const svgRef = useRef()
  const d3 = window.d3v4

  var df = {}
  Object.assign(df, data.dfList)

  useEffect(() => {
    var svg = d3.select(svgRef.current)
    d3.select(svgRef.current).selectAll("*").remove()

    var data = []
    var ordinals = []

    for (var i = 0; i < 20; i++) {
      data.push({
        value: df[i],
        index: i,
      })
      ordinals.push(i)
    }

    var margin = { top: 20, right: 20, bottom: 20, left: 20 },
      width = svgRef.current.clientWidth - margin.left - margin.right,
      height = svgRef.current.clientHeight - margin.top - margin.bottom,
      height2 = 40

    svg.attr("width", width).attr("height", height)

    var focus = svg
      .append("g")
      .attr("class", "focus")
      .attr(
        "transform",
        "translate(" + margin.left + "," + (margin.top - height2 * 2) + ")"
      )

    var context = svg
      .append("g")
      .attr("class", "context")
      .attr(
        "transform",
        "translate(" + margin.left + "," + (margin.top + height - height2) + ")"
      )

    var x = d3.scaleLinear().range([0, width])
    var x2 = d3.scaleLinear().range([0, width])
    var y = d3.scaleLinear().range([height, 0])
    var y2 = d3.scaleLinear().range([height2, 0])

    var xBand = d3
      .scaleBand()
      .domain(d3.range(-1, ordinals.length))
      .range([0, width])

    var xAxis = d3.axisBottom(x).tickFormat((d, e) => ordinals[d])
    var yAxis = d3.axisLeft(y)

    var brush = d3
      .brushX()
      .extent([
        [0, 0],
        [width, height2],
      ])
      .on("brush", brushed)

    x.domain([-1, ordinals.length])
    y.domain([0, d3.max(data, (d) => d.value)])
    x2.domain(x.domain())
    y2.domain([0, d3.max(data, (d) => d.value)])

    focus
      .append("g")
      .attr("clip-path", "url(#my-clip-path)")
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => {
        return x(i) - (xBand.bandwidth() * 0.9) / 2
      })
      .attr("y", (d, i) => {
        return y(d.value)
      })
      .attr("width", xBand.bandwidth() * 0.9)
      .attr("height", (d) => {
        return height - y(d.value)
      })
      .style("fill", "#cccccc")

    focus
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + 0 + "," + height + ")")
      .call(xAxis)

    focus.append("g").attr("class", "axis axis--y").call(yAxis)

    var defs = focus.append("defs")

    defs
      .append("clipPath")
      .attr("id", "my-clip-path")
      .append("rect")
      .attr("width", width)
      .attr("height", height)

    context
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => {
        return x2(i) - (xBand.bandwidth() * 0.9) / 2
      })
      .attr("y", (d, i) => y2(d.value))
      .attr("width", xBand.bandwidth() * 0.9)
      .attr("height", (d) => {
        return height2 - y2(d.value)
      })
      .style("fill", "#cccccc")

    context
      .append("g")
      .attr("class", "axis2")
      .attr("transform", "translate(" + 0 + "," + height2 + ")")
      .call(xAxis)

    context
      .append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, x.range())

    function brushed() {
      var s = d3.event.selection || x2.range()

      focus.selectAll("rect").style("fill", (d, i) => {
        if (i >= x.invert(s[0]) && i <= x.invert(s[1])) {
          return "steelblue"
        } else {
          return "#cccccc"
        }
      })
    }
  }, [data, d3, df])

  return (
    <div className="svg-wrapper">
      <svg ref={svgRef}></svg>
    </div>
  )
}
