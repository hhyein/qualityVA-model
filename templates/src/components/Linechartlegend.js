import React, { useEffect, useRef } from 'react'

function Linechartlegend(props) {
  const {data} = props
  const svgRef = useRef()
  const d3 = window.d3v4

  useEffect(() => {
    var svg = d3.select(svgRef.current);
    d3.select(svgRef.current).selectAll("*").remove();

    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
      width = svgRef.current.clientWidth - margin.left - margin.right,
      height = svgRef.current.clientHeight - margin.top - margin.bottom

    svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("circle").attr("cx", 10).attr("cy", 20).attr("r", 6).style("fill", "#eb3477")
    svg.append("text").attr("x", 20).attr("y", 20).text("lr").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("circle").attr("cx", 75).attr("cy", 20).attr("r", 6).style("fill", "#8934eb")
    svg.append("text").attr("x", 85).attr("y", 20).text("knn").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("circle").attr("cx", 145).attr("cy", 20).attr("r", 6).style("fill", "#4ceb34")
    svg.append("text").attr("x", 155).attr("y", 20).text("nb").style("font-size", "15px").attr("alignment-baseline","middle")

    }, [props.data]);

  return (
    <>
      <svg ref = {svgRef} style={{ width: "100%", height: "15%" }}>
      </svg>
    </>
  );
}
export default Linechartlegend