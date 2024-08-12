import React, { useEffect } from 'react';
import * as d3 from 'd3';
import './DirectedGraph.css';  // 引入样式文件

function DirectedGraph({ nodes, links }) {  // 从props中获取nodes和links
  useEffect(() => {
    const svg = d3.select("#d3-container")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", [-window.innerWidth / 2, -window.innerHeight / 2, window.innerWidth, window.innerHeight]);

    // 定义箭头
    svg.append("defs").selectAll("marker")
      .data(["end"])
      .enter().append("marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -1.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5");

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))  // 增加链接的距离
      .force("charge", d3.forceManyBody().strength(-500))  // 增加节点之间的排斥力
      .force("center", d3.forceCenter());  // 将力导向图的中心设置为SVG元素的中心

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .style("stroke", "#999")
      .style("stroke-opacity", 0.6)
      .style("stroke-width", d => Math.sqrt(d.value))
      .attr("marker-end", "url(#end)");  // 添加箭头

      const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 5)
      .style("fill", d => d.color || "#69b3a2");

    // 添加节点文字
    const text = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text(d => d.id)
      .attr("x", d => d.x)
      .attr("y", d => d.y - 10)  // 调整文字的位置，使其在节点上方
      .attr("dy", "0.35em");

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      text
        .attr("x", d => d.x)
        .attr("y", d => d.y - 10);  // 调整文字的位置，使其在节点上方
    });
  }, [nodes, links]);  // 当nodes或links改变时，重新运行useEffect

  return <div id="d3-container"></div>;
}

export default DirectedGraph;
