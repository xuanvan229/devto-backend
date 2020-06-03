// Require dependencies
const helpers = require('../app/helpers')
const logger = require('morgan');
const bodyParser= require('body-parser')
const moment = require('moment-timezone');
const express = require('express');
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const Config = require("../config");
const axios = require("axios");
const convert = require('xml-js');
const MegaFourFive = require('../models/MegaFourFive');
const api = require('../api');


async function getReport(req,res) {
  let startDate = moment(req.query.startDate, "DD/MM/YYYY").tz('Asia/Ho_Chi_Minh').startOf('day') // true
  let endDate = moment(req.query.endDate, "DD/MM/YYYY").tz('Asia/Ho_Chi_Minh').startOf('day') // true
  let result = await MegaFourFive.find({
    date: {
      $lt: endDate.toDate(),
      $gte: startDate.toDate()
    }
  });

  let arrayResult = []
  result.forEach(item => {
    arrayResult = [...arrayResult, ...item.result]
  })
  let report = arrayResult.reduce((result, item) => {
    if(result[`${item}`] ){
      result[`${item}`] = result[`${item}`] + 1
    } else {
      result[`${item}`] = 1
    }
    return result;
  }, {})
  res.json(report);
}

async function getReportByDateOfWeek(req, res) {
  let result = await MegaFourFive.find({});
  let date = parseInt(req.query.date) // true

  let resultFilter =result.filter(item => {
    console.log(moment(item.date).tz('Asia/Ho_Chi_Minh').day(), date)
    if(moment(item.date).tz('Asia/Ho_Chi_Minh').day() === date) {
      return true
    }
    return false;
  })

  console.log(resultFilter)
  let arrayResult = []
  resultFilter.forEach(item => {
    arrayResult = [...arrayResult, ...item.result]
  })
  let report = arrayResult.reduce((result, item) => {
    if(result[`${item}`] ){
      result[`${item}`] = result[`${item}`] + 1
    } else {
      result[`${item}`] = 1
    }
    return result;
  }, {})
  res.json(report);
}


async function getReportOfNumber(req, res) {
  const numberRequest = parseInt(req.query.number);
  let resultQuery = await MegaFourFive.find({
    result: numberRequest
  });

  let report = resultQuery.reduce((result, item) => {
    let monthName = moment(item.date).tz('Asia/Ho_Chi_Minh').format("MMM");
    console.log(result)
    if(result[`${monthName}`] ){
      result[`${monthName}`] = result[`${monthName}`] + 1
    } else {
      result[`${monthName}`] = 1
    }
    return result;
  }, {})

  let sortReport ={
    "Jan": report.Jan,
    "Feb": report.Feb,
    "Mar": report.Mar,
    "Apr": report.Apr,
    "May": report.May,
    "Jun": report.Jun,
    "Jul": report.Jul,
    "Aug": report.Aug,
    "Sep": report.Sep,
    "Oct": report.Oct,
    "Nov": report.Nov,
    "Dec": report.Dec,
}

  res.json(sortReport);
}



module.exports  = {
  getReport,
  getReportByDateOfWeek,
  getReportOfNumber,
};