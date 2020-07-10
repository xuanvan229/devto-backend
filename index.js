// Require dependencies
const helpers = require("./app/helpers");
const logger = require("morgan");
const bodyParser = require("body-parser");
const moment = require("moment-timezone");
const express = require("express");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
// const Config = require("./config");
const axios = require("axios");
const convert = require("xml-js");
const MegaFourFive = require("./models/MegaFourFive");
const api = require("./api");
const schedule = require("node-schedule");

// Create an Express application
const app = express();
// Configure the app port
const port = process.env.PORT || 8000;

// this is our MongoDB database
// const dbRoute = Config.DBRoute;
// // const clientHost = Config.CLIENT_HOST;
// mongoose.connect(
//   dbRoute,
//   { useNewUrlParser: true, useUnifiedTopology: true }
// );

// let db = mongoose.connection;
// db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
// db.on("error", console.error.bind(console, "MongoDB connection error:"));

const getData = async (url) => {
  let $ = await helpers.fetchHtmlFromUrl(url);
  $(".sidebar-1")
    .find("img")
    .each((index, item) => {
      const src = $(item).attr("data-src");
      if (src) {
        $(item).attr("src", src).html();
      }
      // console.log("src", src);
    });
  $(".sidebar-1").find(".header-content").remove();
  $(".sidebar-1").find(".footer-content").remove();
  $(".sidebar-1.pin-comment").remove();
  return cheerio.html($(".sidebar-1"));
};

const getXml = async () => {
  let result = await axios.get("https://vnexpress.net/rss/tin-moi-nhat.rss");
  // parser = new DOMParser();
  // xmlDoc = parser.parseFromString(result.data,"text/xml");
  var result1 = convert.xml2json(result.data, { compact: true, spaces: 4 });
  return result1;
  console.log("result", result1);
};

const getXmlHome = async () => {
  let result = await axios.get("https://vnexpress.net/rss/tin-moi-nhat.rss");
  const result1 = convert.xml2json(result.data, { compact: true, spaces: 4 });
  const data = JSON.parse(result1);
  const listData = data.rss.channel.item;
  let datarequestPromise = listData.map(async (item) => {
    let html = await getData(item.link._text);
    let newsData = {
      _id: new mongoose.Types.ObjectId(),
      title: item.title._text,
      date: new Date(item.pubDate._text),
      content: html,
    };
    return newsData;
  });
  let datarequest = await Promise.all(datarequestPromise);
  News.insertMany(datarequest, function (error, docs) {
    console.log("docs", docs);
    console.log("error", error);
  });

  return {
    status: "ok",
  };
  console.log("listData", datarequest);
};

// getXmlHome();
var cronExpress = "*/5 * * * * * *";
var j = schedule.scheduleJob("*/1 * * * *", function (fireDate) {
  console.log(
    "This job was supposed to run at " +
      fireDate +
      ", but actually ran at " +
      new Date()
  );
});

// console.log(j)

// getData();
app.set("port", port);
// Load middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const getResultPost = async (url) => {
  let result = await api.get({ url });
  let $ = cheerio.load(result.data);
  let array = [];
  let data = cheerio.html($("#article-body"));
  let title;
  $("#main-title")
    .find("h1")
    .each((index, item) => {
      title = $(item).text();
    });
  $(".article-body")
    .find("p")
    .each((index, item) => {
      let number = $(item).text();
      array.push(parseInt(number));
    });
  // let data = c
  return { content: data, title };
};

app.get("/get-post", async (req, res) => {
  const url = "https://dev.to" + req.query.path;
  const result = await getResultPost(url);
  res.json(200, result);
});

app.get("/get-path", async (req, res) => {
  const result = [
    {
      params: {
        alias: "thepracticaldev",
        id: "daily-challenge-267-braking-speed-2hf0",
      },
    },
    {
      params: {
        alias: "helderburato",
        id: "how-are-you-dealing-with-quarantine-57ad",
      },
    },
    {
      params: {
        alias: "angelcodes",
        id: "react-app-with-tailwind-css-emotion-twin-macro-3dpe",
      },
    },
  ];
  res.json(200, result);
});
// Start the server and listen on the preconfigured port
app.listen(port, () => console.log(`App started on port ${port}.`));
