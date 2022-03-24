import React, { useEffect, useRef } from 'react'

function Histogramchart2(props) {
  const {data} = props
  const svgRef = useRef()
  const d3 = window.d3v4

  useEffect(() => {
    var svg = d3.select(svgRef.current);
    d3.select(svgRef.current).selectAll("*").remove();

    var margin = { top: 20, right: 20, bottom: 20, left: 20 },
      width = 300 - margin.left - margin.right,
      height = 80 - margin.top - margin.bottom;

    svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv", function(data) {
      var x = d3.scaleLinear()
          .domain([0, 1000])
          .range([0, width]);
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      var histogram = d3.histogram()
          .value(function(d) { return d.price; })
          .domain(x.domain())
          .thresholds(x.ticks(70));

      var bins = histogram(data);

      var y = d3.scaleLinear()
          .range([height, 0]);
          y.domain([0, d3.max(bins, function(d) { return d.length; })]);
      svg.append("g")
          .call(d3.axisLeft(y));

      var myHistogram = svg.selectAll("rect")
          .data(bins)
          .enter()
          .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", function(d) {
              if (d.x0 > 700) { return "red"; }
              else { return "#69b3a2"; }
          })
    });
    }, [props.data]);

  return (
    <>
      <svg ref = {svgRef}>
      </svg>
    </>
  );
}
export default Histogramchart2
