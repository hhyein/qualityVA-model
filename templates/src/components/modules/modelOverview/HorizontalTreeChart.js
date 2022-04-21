import React, { useEffect, useRef } from "react"

export default function HorizontalTreeChart() {
  const svgRef = useRef()
  const d3 = window.d3v3

  var data = [
    {
      index: "0",
      state: "none",
      name: "start",
      children: [
        {
          index: "1",
          state: "none",
          name: "EM",
          children: [
            {
              index: "2",
              state: "none",
              name: "LOCF",
              children: [
                {
                  index: "3",
                  state: "none",
                  name: "normalization",
                  children: [
                    {
                      index: "4",
                      state: "none",
                      name: "remove",
                      children: [
                        {
                          index: "5",
                          state: "current",
                          name: "remove",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]

  useEffect(() => {
    var margin = { top: 0, right: 0, bottom: 0, left: 20 },
      width = svgRef.current.clientWidth - margin.left - margin.right,
      height = svgRef.current.clientHeight - margin.top - margin.bottom

    var i = 0

    d3.select(svgRef.current).selectAll("*").remove()

    var svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var tree = d3.layout.tree().size([height, width])
    var diagonal = d3.svg.diagonal().projection(function (d) {
      return [d.y, d.x]
    })

    var root = data[0]
    update(root)

    function update() {
      var nodes = tree.nodes(root).reverse()
      var links = tree.links(nodes)

      nodes.forEach(function (d) {
        d.x = 20
        d.y = d.depth * 88
      })

      var node = svg.selectAll("g.node").data(nodes, function (d) {
        return d.id || (d.id = ++i)
      })

      var nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
          return "translate(" + d.y + "," + d.x + ")"
        })

      nodeEnter
        .append("circle")
        .attr("r", 10)
        .style("fill", function (d) {
          if (d.state == "current") {
            return "#999999"
          } else {
            return "#cccccc"
          }
        })

      nodeEnter
        .append("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text(function (d) {
          return d.index
        })

      var link = svg
        .selectAll("path.link")
        .data(links)
        .enter()
        .insert("path", "g")
        .attr("class", "link")
        .attr("d", diagonal)
    }
  }, [])

  return (
    <svg ref={svgRef} style={{ width: "100%", height: "25%" }}></svg>
  )
}