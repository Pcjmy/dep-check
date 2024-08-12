import React, { useState, useEffect } from 'react';
import { getPackageDependencies } from '../utils/dep';
import { getNpmDepGraph } from '../utils/graph';
import DirectedGraph from './components/DirectedGraph';

const nodes = [
  { id: "Node 1", color: "red" },
  { id: "Node 2", color: "orange" },
  { id: "Node 3", color: "aqua" },
  { id: "Node 4", color: "pink" },
  { id: "Node 5", color: "purple" },
];

const links = [
  { source: "Node 1", target: "Node 2" },
  { source: "Node 2", target: "Node 3" },
  { source: "Node 3", target: "Node 4" },
  { source: "Node 4", target: "Node 1" },
  { source: "Node 5", target: "Node 2" }
];

const Home = () => {
  const [packageName, setPackageName] = useState('');
  const [dependencies, setDependencies] = useState(null);

  const handleClick = async () => {
    const dependencies = await getPackageDependencies(packageName);
    setDependencies(dependencies);
  }

  useEffect(() => {
    const getDependencies = async () => {
      const graph = await getNpmDepGraph('antd', '5.0.0');
      console.log('graph=', graph);
    }
    getDependencies();
  }, [])

  return <DirectedGraph nodes={nodes} links={links} />;

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
