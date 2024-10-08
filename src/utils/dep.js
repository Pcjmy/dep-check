import axios from 'axios';

export const getPackageDependencies = async (packageName, version) => {
  try {
    const response = await axios.get(`https://registry.npmmirror.com/${packageName}`);
    return response.data.versions[version || response.data['dist-tags'].latest]?.dependencies;
  } catch (error) {
    console.error('Failed to fetch package info', error);
  }
};

export const getLatestVersion = async (packageName) => {
  try {
    const response = await axios.get(`https://registry.npmmirror.com/${packageName}`);
    return response.data['dist-tags'].latest;
  } catch (error) {
    console.error('Failed to fetch package info', error);
  }
};

export const getVersion = (version) => {
  version = version.replace(/[\^~]/g, '');
  version = version.replace(/-.+$/, '');
  return version;
}
