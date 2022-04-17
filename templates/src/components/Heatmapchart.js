import React, { useEffect, useRef } from 'react'

function Heatmapchart(props) {
  const {data, yList, columnList} = props
  const svgRef = useRef()
  const d3 = window.d3v4

  useEffect(() => {
    var svg = d3.select(svgRef.current);
    d3.select(svgRef.current).selectAll("*").remove();

    var margin = { top: 20, right: 20, bottom: 20, left: 20 },
      width = svgRef.current.clientWidth - margin.left - margin.right,
      height = svgRef.current.clientHeight - margin.top - margin.bottom

      svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(columnList)
        .padding(0.05)

      var y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(yList)
        .padding(0.05)
      
      var color1 = d3.scaleLinear()
        .range(["white", "#9e9e9e"])
        .domain([0, 100])

      var color2 = d3.scaleLinear()
        .range(["white", "steelblue"])
        .domain([0, 100])

      var mouseover = function(d) {
        d3.select(this)
          .style("stroke", "#999999")
          .style("stroke-width", "2px")
          .style("opacity", 1)
      }
      var mouseleave = function(d) {
        d3.select(this)
          .style("stroke", "none")
          .style("opacity", 0.8)
      }

      svg.selectAll()
        .data(data, function(d) {return d.index + ':' + d.y;})
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.index) })
        .attr("y", function(d) { return y(d.y) })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .style("fill", function(d) {
          if (d.value == 0) {
            return color1(20);
          }
          return color2(d.value * 20);
        })
        .style("stroke-width", 4)
        .style("stroke", "none")
        .style("opacity", 0.8)
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)

    }, [props.data, props.yList, props.columnList]);

  return (
    <div className = "svg-wrapper">
      <svg ref = {svgRef}></svg>
    </div>
  );
}
export default Heatmapchart
