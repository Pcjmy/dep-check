import { getPackageDependencies, getLatestVersion, getVersion } from './dep';

class Node {
  constructor(name, version) {
    this.name = name;
    this.version = version;
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
  }

  bfs() {
    const colors = ['red', 'aqua', 'orange', 'yellow', 'pink', 'purple']
    const nodes = []
    const links = []
    const queue = [{ node: this.start, depth: 1}];
    const start_node = {id: `${this.start.name}@${this.start.version}`, color: colors[0]};
    nodes.push(start_node)
    const visited = new Set();
    visited.add(start_node.id);

    while (queue.length) {
      const item = queue.shift();
      // console.log(node);
      const neighbors = this.adjacencyList.get(item.node);
      console.log('neighbors=', neighbors);
      if (neighbors) {
        for (const neighbor of neighbors) {
          const v1 = {id: `${item.node.name}@${item.node.version}`, color: colors[item.depth - 1]}
          const v2 = {id: `${neighbor.name}@${neighbor.version}`, color: colors[item.depth]}
          console.log(v1, v2);
          if (!visited.has(v2.id)) {
            nodes.push(v2);
            visited.add(v2.id);
            links.push({source: v1.id, target: v2.id});
            queue.push({ node: neighbor, depth: item.depth + 1 });
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
  const start = new Node(packageName, packageVersion);
  const graph = new Graph(start);

  const queue = [{ node: start, depth: 1 } ];
  const visited = new Set();
  visited.add(start);

  while (queue.length) {
    const item = queue.shift();
    if (item.depth > maxDepth) return graph;
    const dependencies = await getPackageDependencies(item.node.name, getVersion(item.node.version));
    if (dependencies) {
      for (const [name, version] of Object.entries(dependencies)) {
        const child = new Node(name, version);
        graph.addEdge(item.node, child);
        // console.log(item.node, child);
        if (!visited.has(child)) {
          visited.add(child);
          queue.push({ node: child, depth: item.depth + 1 });
        }
      }
    }
  }

  return graph;
}
