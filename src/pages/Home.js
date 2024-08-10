import React, { useState } from 'react';
import { getPackageDependencies } from '../utils';

const Home = () => {
  const [packageName, setPackageName] = useState('');
  const [dependencies, setDependencies] = useState(null);

  const handleClick = async () => {
    const dependencies = await getPackageDependencies(packageName);
    setDependencies(dependencies);
  }

  return (
    <div>
      <input
        type="text"
        value={packageName}
        onChange={e => setPackageName(e.target.value)}
      />
      <button onClick={handleClick}>Fetch Package Info</button>
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
