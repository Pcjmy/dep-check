import React, { useState, useEffect } from 'react';
import { getNpmDepGraph } from '../utils/graph';
import { Input, Button, Spin } from 'antd';
import DirectedGraph from './components/DirectedGraph';
import './Home.css';

const Home = () => {
  const [packageName, setPackageName] = useState('');
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDependencies = async () => {
    setLoading(true);
    const graph = await getNpmDepGraph(packageName || 'vue', 'latest');
    console.log('graph=', graph);
    const { nodes, links } = graph.bfs();
    setNodes(nodes);
    setLinks(links);
    console.log(nodes, links);
    setLoading(false);
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
      <Spin spinning={loading}>
        <DirectedGraph nodes={nodes} links={links} />
      </Spin>
    </div>
  );
};

export default Home;
