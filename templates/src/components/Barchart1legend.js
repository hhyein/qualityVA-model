import React, { useEffect, useRef } from 'react'

function Barchart1legend(props) {
  const {data} = props
  const svgRef = useRef()
  const d3 = window.d3v4

  useEffect(() => {
    var svg = d3.select(svgRef.current);
    d3.select(svgRef.current).selectAll("*").remove();

    var margin = { top: 0, right: 0, bottom: 10, left: 0 },
      width = 275 - margin.left - margin.right,
      height = 30 - margin.top - margin.bottom

    svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("circle").attr("cx", 10).attr("cy", 20).attr("r", 6).style("fill", "steelblue")
    svg.append("text").attr("x", 20).attr("y", 20).text("missing").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("circle").attr("cx", 100).attr("cy", 20).attr("r", 6).style("fill", "orange")
    svg.append("text").attr("x", 110).attr("y", 20).text("outlier").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("circle").attr("cx", 180).attr("cy", 20).attr("r", 6).style("fill", "darkgreen")
    svg.append("text").attr("x", 190).attr("y", 20).text("inconsistent").style("font-size", "15px").attr("alignment-baseline","middle")

    }, [props.data]);

  return (
    <>
      <svg ref = {svgRef}>
      </svg>
    </>
  );
}
export default Barchart1legend