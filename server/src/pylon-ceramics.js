const axios = require("axios");
const csv = require("csvtojson");
const Instagram = require("instagram-web-api");

function cachePromise(worker) {
  let resultPromise = null;
  return () => {
    return Promise.resolve()
    .then(() => {
      if (!resultPromise) {
        setTimeout(() => resultPromise = null, 5 * 60 * 1000);
        resultPromise = worker()
          .catch(e => {
            console.log("Caught error", e.message);
            throw e;
          });
      }
      return resultPromise;
    });
  }
}

const instagramCredentials = {
  username: process.env.IG_USERNAME, 
  password: process.env.IG_PASSWORD
};

module.exports = (app) => {
  // instagram
  const cachedInstagramFetch = cachePromise(() => {
    const client = new Instagram(instagramCredentials);
    return client.login()
      .then(() => client.getPhotosByUsername({username: "pylon_ceramics"}))  
  });
  app.get("/pcig", function(req, res) {
    cachedInstagramFetch()
    .then(
      d => res.status(200).send(d), 
      e => res.status(500).send(e.message)
    );
  });
  
  // Google docs
  const url = "https://docs.google.com/spreadsheets/d/1rOtUZXy1pkbovGWtDd6RhdV02pZM1VpNLus1oUkd-4c/pub?output=csv";
  const cachedGoogleDocsRequest = cachePromise(() => 
    axios.get(url)
      .then(response => {
        return csv({
            noheader:true,
            output: "csv"
        }).fromString(response.data)
        .then(d => 
          // this seems to be a bug in the parsing library
          d.map(r => r.map(c => c.replace(/"$/, "")))
        )
      }));
  app.get("/pcgd", function(req, res) {
    cachedGoogleDocsRequest()
    .then(
      d => res.status(200).send(d), 
      e => res.status(500).send(e.message)
    );
  });
};