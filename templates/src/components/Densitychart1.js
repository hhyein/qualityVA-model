import React, { useEffect, useRef } from 'react'

function Densitychart1(props) {
  const {data} = props
  const svgRef = useRef()
  const d3 = window.d3v4

  var df = []
  Object.assign(df, data[0].Value)

  var columnName = []
  Object.assign(columnName, Object.keys(data[0].Value[0]))

  useEffect(() => {
    var svg = d3.select(svgRef.current)
    d3.select(svgRef.current).selectAll('*').remove()

    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
      width = 150 - margin.left - margin.right,
      height = 30 - margin.top - margin.bottom

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
      .domain([d3.min(df, d => d.value) - 10, d3.max(df, d => d.value) + 10])
      .range([0, width])
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(0))
      .selectAll("text")
      .remove()

    var y = d3.scaleLinear()
      .domain([0, 0.15])
      .range([height, 0])
    svg.append("g")
      .call(d3.axisLeft(y).ticks(0))
      .selectAll("text")
      .remove()

    var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40))
    var density1 =  kde( df
      .filter( function(d){ return d.index === "normal"; })
      .map(function(d){  return d.value; })
    )
    var density2 =  kde( df
      .filter( function(d){return d.index === "data"; })
      .map(function(d){  return d.value; })
    )

    svg.append("path")
      .attr("class", "mypath")
      .datum(density1)
      .attr("fill", "none")
      .attr("stroke", "#cccccc")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { return x(d[0]); })
      .y(function(d) { return y(d[1]); })
    )

    svg.append("path")
      .attr("class", "mypath")
      .datum(density2)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { return x(d[0]); })
      .y(function(d) { return y(d[1]); })
    );

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
      <svg ref = {svgRef}>
      </svg>
    </>
  );
}
export default Densitychart1
