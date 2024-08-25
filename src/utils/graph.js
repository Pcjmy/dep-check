import { getPackageDependencies, getLatestVersion, getVersion } from './dep';

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
    const colors = ['red', 'aqua', 'orange', 'yellow', 'pink', 'purple']
    const nodes = []
    const links = []
    const queue = [this.start];
    const start_node = {id: `${this.start.name}@${this.start.version}`, color: colors[0]};
    nodes.push(start_node)
    const visited = new Set();
    visited.add(start_node.id);

    while (queue.length) {
      const node = queue.shift();
      // console.log(node);
      const neighbors = this.adjacencyList.get(node);
      console.log('neighbors=', neighbors);
      if (neighbors) {
        for (const neighbor of neighbors) {
          const v1 = {id: `${node.name}@${node.version}`, color: colors[node.depth - 1]}
          const v2 = {id: `${neighbor.name}@${neighbor.version}`, color: colors[neighbor.depth - 1]}
          if (!visited.has(v2.id)) {
            links.push({source: v1.id, target: v2.id})
            nodes.push(v2);
            visited.add(v2.id);
            queue.push(neighbor);
          }
        }
      }
    }
    
    return { nodes, links }
  }
}

export const getNpmDepGraph = async (packageName, version, maxDepth = 2) => {
  let packageVersion = version;
  if (packageVersion === 'latest') {
    packageVersion = await getLatestVersion(packageName);
  }
  const start = new Node(packageName, packageVersion, 1);
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
        // console.log(node, child);
        if (!visited.has(child)) {
          visited.add(child);
          queue.push(child);
        }
      }
    }
  }

  return graph;
}
