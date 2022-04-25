import React, { useEffect, useRef } from 'react'

function BarChart(props) {
  const { data } = props
  const svgRef = useRef()
  const d3 = window.d3v4

  useEffect(() => {
    var svg = d3.select(svgRef.current)
    d3.select(svgRef.current).selectAll('*').remove()

    // set the dimensions and margins of the graph
    var margin = {top: 0, right: 0, bottom: 10, left: 0},
        width = 100 - margin.left - margin.right,
        height = 50 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv", function(data) {

      // List of subgroups = header of the csv files = soil condition here
      var subgroups = data.columns.slice(1)

      // List of groups = species here = value of the first column called group -> I show them on the X axis
      var groups = d3.map(data, function(d){return(d.group)}).keys()

      // Add X axis
      var x = d3.scaleBand()
          .domain(groups)
          .range([0, width])
          .padding([0.2])
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")
        .remove()

      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, 40])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y));

      // Another scale for subgroup position?
      var xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05])

      // color palette = one color per subgroup
      var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#e41a1c','#377eb8','#4daf4a'])

      // Show the bars
      svg.append("g")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(data)
        .enter()
        .append("g")
          .attr("transform", function(d) { return "translate(" + x(d.group) + ",0)"; })
        .selectAll("rect")
        .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
        .enter().append("rect")
          .attr("x", function(d) { return xSubgroup(d.key); })
          .attr("y", function(d) { return y(d.value); })
          .attr("width", xSubgroup.bandwidth())
          .attr("height", function(d) { return height - y(d.value); })
          .attr("fill", function(d) { return color(d.key); });

    })
  }, [data])

  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  )
}
export default BarChart