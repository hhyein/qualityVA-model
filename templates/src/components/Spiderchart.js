import React, { useEffect, useRef } from 'react';

function Barchart(props) {
  const {data} = props;
  console.log(data);

  const svgRef = useRef();
  const d3 = window.d3v4;

  useEffect(() => {
    var svg = d3.select(svgRef.current)
    d3.select(svgRef.current).selectAll("*").remove();

    var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 200 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    const data = [];
    const features = ["A","B","C"];

    for (var i = 0; i < 3; i++) {
      const point = {}
      features.forEach(f => point[f] = 1 + Math.random() * 8);
      data.push(point);
    }

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    var radialScale = d3.scaleLinear()
      .domain([0,10])
      .range([0,100]);
    var ticks = [2,4,6,8,10];

    ticks.forEach(t =>
      svg.append("circle")
      .attr("cx", 100)
      .attr("cy", 100)
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("r", radialScale(t))
    );

    ticks.forEach(t =>
      svg.append("text")
      .attr("x", 100)
      .attr("y", 100 - radialScale(t))
    );

    function angleToCoordinate(angle, value){
      var x = Math.cos(angle) * radialScale(value);
      var y = Math.sin(angle) * radialScale(value);
      return {"x": 100 + x, "y": 100 - y};
    }

    for (i = 0; i < features.length; i++) {
      var ft_name = features[i];
      var angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
      var line_coordinate = angleToCoordinate(angle, 10);
      var label_coordinate = angleToCoordinate(angle, 10.5);
  
      //draw axis line
      svg.append("line")
      .attr("x1", 100)
      .attr("y1", 100)
      .attr("x2", line_coordinate.x)
      .attr("y2", line_coordinate.y)
      .attr("stroke","black");
  
      //draw axis label
      svg.append("text")
      .attr("x", label_coordinate.x)
      .attr("y", label_coordinate.y)
      .text(ft_name);
    }

    var line = d3.line()
      .x(d => d.x)
      .y(d => d.y);
    
    var colors = ["darkorange", "gray", "navy"];

    function getPathCoordinates(data_point){
      var coordinates = [];
      for (i = 0; i < features.length; i++){
          var ft_name = features[i];
          var angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
          coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
      }
      return coordinates;
    }
    
    for (i = 0; i < data.length; i ++){
      var d = data[i];
      var color = colors[i];
      var coordinates = getPathCoordinates(d);
  
      //draw the path element
      svg.append("path")
      .datum(coordinates)
      .attr("d",line)
      .attr("stroke-width", 3)
      .attr("stroke", color)
      .attr("fill", color)
      .attr("stroke-opacity", 1)
      .attr("opacity", 0.5);
    }
    }, [props.data]);


    
  return (
    <>
      <svg ref={svgRef}>
      </svg>
    </>
  );
}
export default Barchart;