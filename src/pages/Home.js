import React, { useState, useEffect } from 'react';
import { getNpmDepGraph } from '../utils/graph';
import { Input, Button } from 'antd';
import DirectedGraph from './components/DirectedGraph';
import './Home.css';

// const nodes = [
//   { id: "Node 1", color: "red" },
//   { id: "Node 2", color: "orange" },
//   { id: "Node 3", color: "aqua" },
//   { id: "Node 4", color: "pink" },
//   { id: "Node 5", color: "purple" },
// ];

// const links = [
//   { source: "Node 1", target: "Node 2" },
//   { source: "Node 2", target: "Node 3" },
//   { source: "Node 3", target: "Node 4" },
//   { source: "Node 4", target: "Node 1" },
//   { source: "Node 5", target: "Node 2" }
// ];

const Home = () => {
  const [packageName, setPackageName] = useState('');
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  const getDependencies = async () => {
    const graph = await getNpmDepGraph(packageName || 'vue', 'latest');
    console.log('graph=', graph);
    const { nodes, links } = graph.bfs();
    setNodes(nodes);
    setLinks(links);
    console.log(nodes, links);
  }

  useEffect(() => {
    getDependencies();
  }, [])

  return (
    <div className="container">
      <div className="header">
        <Input placeholder="please input package name" value={packageName} onChange={e => setPackageName(e.target.value)} />
        <div className="search-btn">
          <Button type="primary" onClick={getDependencies}>查询</Button>
        </div>
      </div>
      <DirectedGraph nodes={nodes} links={links} />
    </div>
  );

  // return (
  //   <div>
  //     <input
  //       type="text"
  //       value={packageName}
  //       onChange={e => setPackageName(e.target.value)}
  //     />
  //     <button onClick={handleClick}>Fetch Package Info</button>
  //     {dependencies && (
  //       <ul>
  //         {Object.keys(dependencies).map(dependency => (
  //           <li key={dependency}>{dependency}: {dependencies[dependency]}</li>
  //         ))}
  //       </ul>
  //     )}
  //   </div>
  // );
};

export default Home;
