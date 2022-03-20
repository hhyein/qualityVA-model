import React, { useEffect, useRef } from 'react';

function Barchart1(props) {
  const {data} = props;
  const svgRef = useRef();
  const d3 = window.d3v4;

  useEffect(() => {
    var svg = d3.select(svgRef.current);
    d3.select(svgRef.current).selectAll("*").remove();

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 20, left: 50},
        width = 200 - margin.left - margin.right,
        height = 80 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, 1300])
      .range([ 0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Y axis
    var y = d3.scaleBand()
      .range([ 0, height ])
      .padding(.2);
    svg.append("g")
      .call(d3.axisLeft(y));

    //Bars
    svg.selectAll("myRect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", x(0) )
      .attr("y", function(d) { return y(d.Country); })
      .attr("width", function(d) { return x(d.Value); })
      .attr("height", y.bandwidth() )
      .attr("fill", "#69b3a2")
    }, [props.data]);


    
  return (
    <>
      <svg ref={svgRef}>
      </svg>
    </>
  );
}
export default Barchart1;
