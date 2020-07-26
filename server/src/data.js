const fs = require("fs");
const path = require("path");

const filename = path.join(__dirname, '../data.json');

let cache = null;
const getData = () => {
  if (!cache) {
    try {
      cache = JSON.parse(fs.readFileSync(filename, 'utf8'));
    } catch (e) {
      console.error("Error while parsing data file", e);
    }
  }
  return JSON.parse(JSON.stringify(cache));
}

const setData = (key, value) => {
  const data = getData();
  data[key] = value;
  cache = data;
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

module.exports = {
  getData,
  setData
}