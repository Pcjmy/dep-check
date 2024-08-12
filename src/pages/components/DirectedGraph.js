import React, { useEffect } from 'react';
import * as d3 from 'd3';

function DirectedGraph() {
  useEffect(() => {
    const svg = d3.select("body")
      .append("svg")
      .attr("width", 500)
      .attr("height", 500);

    const nodes = [
      { id: "Node 1" },
      { id: "Node 2" },
      { id: "Node 3" },
      { id: "Node 4" },
      { id: "Node 5" }
    ];

    const links = [
      { source: "Node 1", target: "Node 2" },
      { source: "Node 2", target: "Node 3" },
      { source: "Node 3", target: "Node 4" },
      { source: "Node 4", target: "Node 1" },
      { source: "Node 5", target: "Node 2" }
    ];

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(250, 250));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .style("stroke", "#999")
      .style("stroke-opacity", 0.6)
      .style("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 5)
      .style("fill", "#69b3a2");

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    });
  }, []);

  return <div id="d3-container"></div>;
}

export default DirectedGraph;
