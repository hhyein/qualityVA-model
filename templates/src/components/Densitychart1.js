import React, { useEffect, useRef } from 'react';

function Densitychart1(props) {
  const {data} = props;
  console.log(data);

  const svgRef = useRef();
  const d3 = window.d3v4;

  useEffect(() => {
    var svg = d3.select(svgRef.current);
    d3.select(svgRef.current).selectAll("*").remove();

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 30, left: 50},
        width = 200 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // add the x Axis
    var x = d3.scaleLinear()
              .domain([0, 50])
              .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    var y = d3.scaleLinear()
              .range([height, 0])
              .domain([0, 0.01]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Compute kernel density estimation
    var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40))
    var density =  kde( data.map(function(d){  return d.unemployed; }) )

    // Plot the area
    svg.append("path")
        .attr("class", "mypath")
        .datum(density)
        .attr("fill", "#69b3a2")
        .attr("opacity", ".8")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
        .attr("d",  d3.line()
          .curve(d3.curveBasis)
            .x(function(d) { return x(d[0]); })
            .y(function(d) { return y(d[1]); })
        )


    // Function to compute density
    function kernelDensityEstimator(kernel, X) {
      return function(V) {
        return X.map(function(x) {
          return [x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
      };
    }
    function kernelEpanechnikov(k) {
      return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
      };
    }

    }, [props.data]);
    
  return (
    <>
      <svg ref={svgRef}>
      </svg>
    </>
  );
}
export default Densitychart1;