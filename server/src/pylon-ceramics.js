const axios = require("axios");
const csv = require("csvtojson");
const { getData, setData } = require("./data");

function cachePromise(worker) {
  let resultPromise = null;
  return () => {
    return Promise.resolve()
    .then(() => {
      if (!resultPromise) {
        setTimeout(() => resultPromise = null, 5 * 60 * 1000);
        resultPromise = worker()
          .catch(e => {
            console.log("Caught error", e);
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

const refreshIgToken = () => {
  const accessToken = getData().instagramAccessToken;
  console.log(`refreshing IG token ${accessToken}...`);
  return axios.get(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`)
      .then(({ data }) => {
        const newAccessToken = data.access_token;
        console.log(`New access token: ${newAccessToken}`);
        setData("instagramAccessToken", newAccessToken);
      })
      .catch(console.error);
}
setInterval(refreshIgToken, 24 * 60 * 60 * 1000); // Each day

module.exports = (app) => {
  // instagram
  const cachedInstagramFetch = cachePromise(() => {
    const data = getData();
    if (!data || !data.instagramAccessToken) {
      return Promise.reject("no IG access token found or no config file");
    }
    const accessToken = data.instagramAccessToken;
    return axios.get(`https://graph.instagram.com/me/media?fields=caption,media_url,media_type,permalink&access_token=${accessToken}`)
      .then(response => response.data.data.filter(m => m.media_type === "IMAGE"))
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