import { getPackageDependencies, getVersion } from './dep';

class Node {
  constructor(name, version, depth) {
    this.name = name;
    this.version = version;
    this.depth = depth;
  }
}

class Graph {
  constructor(start) {
    this.start = start;
    this.adjacencyList = new Map();
  }

  addVertex(node) {
    if (!this.adjacencyList.has(node)) this.adjacencyList.set(node, []);
  }

  addEdge(node1, node2) {
    if (!this.adjacencyList.has(node1)) {
      this.addVertex(node1);
    }
    if (!this.adjacencyList.has(node2)) {
      this.addVertex(node2);
    }
    this.adjacencyList.get(node1).push(node2);
    this.adjacencyList.get(node2).push(node1);
  }

  bfs() {
    const queue = [this.start];
    const visited = new Set();
    visited.add(this.start);

    while (queue.length) {
      const node = queue.shift();
      console.log(node);
      const neighbors = this.adjacencyList.get(node);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  }
}

export const getNpmDepGraph = async (packageName, version, maxDepth = 5) => {
  const start = new Node(packageName, version, 1);
  const graph = new Graph(start);

  const queue = [start];
  const visited = new Set();
  visited.add(start);

  while (queue.length) {
    const node = queue.shift();
    if (node.depth > maxDepth) return graph;
    const dependencies = await getPackageDependencies(node.name, getVersion(node.version));
    if (dependencies) {
      for (const [name, version] of Object.entries(dependencies)) {
        const child = new Node(name, version, node.depth + 1);
        graph.addEdge(node, child);
        console.log(node, child);
        if (!visited.has(child)) {
          visited.add(child);
          queue.push(child);
        }
      }
    }
  }

  return graph;
}
