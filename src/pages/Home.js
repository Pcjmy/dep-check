import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [packageName, setPackageName] = useState('');
  const [dependencies, setDependencies] = useState(null);

  const fetchPackageInfo = async () => {
    try {
      const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
      setDependencies(response.data.versions[response.data['dist-tags'].latest].dependencies);
    } catch (error) {
      console.error('Failed to fetch package info', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={packageName}
        onChange={e => setPackageName(e.target.value)}
      />
      <button onClick={fetchPackageInfo}>Fetch Package Info</button>
      {dependencies && (
        <ul>
          {Object.keys(dependencies).map(dependency => (
            <li key={dependency}>{dependency}: {dependencies[dependency]}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
