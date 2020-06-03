/* eslint-disable dot-notation */
const axios = require("axios");

// const BASE_URL = "http://qlda.tinhvan.com/dev/hdsaison/lendingapp";

// const BASE_URL = "http://210.211.116.133:1003"
const BASE_URL = "https://vietlott.vn";
const defaultContentType = "application/json";

const requestConfig = {
  url: "/",
  method: "GET",
  baseURL: BASE_URL,
  headers: {
    common: {
      "Content-Type": defaultContentType,
      "Accept-Language": "vi",
      "X-AjaxPro-Method": "ServerSideDrawResult",
      // "x-api-key": "aa86719bb53d3a8fc470210d7e7a1b4388da4fa2",
      // "x-environment": "WEB-ESIGN",
      // Authorization: `Bearer ${token}`,
    },
  },
  params: {},
  data: JSON.stringify({}),
  // dataType: "json",
  timeout: 30000,
  withCredentials: false,
  // `auth` indicates that HTTP Basic auth should be used, and supplies credentials.
  // This will set an `Authorization` header, overwriting any existing
  // `Authorization` custom headers you have set using `headers`.
  // auth: {
  //     // username: 'admin@tinhvan.com',
  //     // password: 'Tinhvan@123'
  // },
  // responseType: "json", // default

  // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
  // xsrfCookieName: "XSRF-TOKEN", // default

  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  // xsrfHeaderName: "X-XSRF-TOKEN", // default
};

function get({ url, params = {}, headersAuthen = null }) {
  requestConfig.url = url;
  requestConfig.method = "GET";
  requestConfig.params = params;

  // request header
  if (headersAuthen !== null) {
    requestConfig.headers.common["Authorization"] = headersAuthen;
  }

  return axios(requestConfig);
}

function post({ url, params = {}, data = {}, headersAuthen = null }) {
  requestConfig.url = url;
  requestConfig.method = "POST";
  requestConfig.params = params;
  requestConfig.data = data;

  // request header8
  if (headersAuthen !== null) {
    requestConfig.headers.common["Authorization"] = headersAuthen;
  }

  return axios(requestConfig);
}

function put({ url, params = {}, data = {}, headersAuthen = null }) {
  requestConfig.url = url;
  requestConfig.method = "PUT";
  requestConfig.params = params;
  requestConfig.data = data;

  // request header8
  if (headersAuthen !== null) {
    requestConfig.headers.common["Authorization"] = headersAuthen;
  }

  return axios(requestConfig);
}

function del({ url, params = {}, data = {}, headersAuthen = null }) {
  requestConfig.url = url;
  requestConfig.method = "DELETE";
  requestConfig.params = params;
  requestConfig.data = data;

  // request header
  if (headersAuthen !== null) {
    requestConfig.headers.common["Authorization"] = headersAuthen;
  }

  return axios(requestConfig);
}


function download({ url, params = {}, data = {}, headersAuthen = null }) {
  requestConfig.url = url;
  requestConfig.method = "POST";
  requestConfig.params = params;
  requestConfig.data = data;
  // request header
  if (headersAuthen !== null) {
    requestConfig.headers.responseType = 'blob'
    requestConfig.headers.common["Authorization"] = headersAuthen;
  }

  return axios(requestConfig);
}

module.exports  = {
  post,
  get,
};