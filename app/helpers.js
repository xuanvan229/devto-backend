const _ = require('lodash');
const axios = require("axios");
const cheerio = require("cheerio");

const categories = [
  {
    name: "Trang Chủ",
    link: "https://vnexpress.net/rss/tin-moi-nhat.rss"
  },
  {
    name: "Thế giới",
    link: "https://vnexpress.net/rss/the-gioi.rss"
  },
  {
    name: "Thời sự",
    link: "https://vnexpress.net/rss/thoi-su.rss"
  },
  {
    name: "Kinh Doanh",
    link: "https://vnexpress.net/rss/kinh-doanh.rss"
  },
  {
    name: "Giải trí",
    link: "https://vnexpress.net/rss/giai-tri.rss"
  },
  {
    name: "Giáo dục",
    link: "https://vnexpress.net/rss/giao-duc.rss"
  },
  {
    name: "Sức khỏe",
    link: "https://vnexpress.net/rss/suc-khoe.rss"
  },
  {
    name: "Khoa học",
    link: "https://vnexpress.net/rss/khoa-hoc.rss"
  }
]


const sendResponse = res => async request => {
  return await request
    .then(data => res.json({ status: "success", data }))
    .catch(({ status: code = 500 }) =>
      res.status(code).json({ status: "failure", code, message: code == 404 ? 'Not found.' : 'Request failed.' })
    );
};

const fetchHtmlFromUrl = async url => {
  return await axios
    .get(url)
    .then(response => cheerio.load(response.data))
    .catch(error => {
      error.status = (error.response && error.response.status) || 500;
      throw error;
    });
};

// Changes XML to JSON
function xmlToJson(xml) {
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

module.exports  = {
  fetchHtmlFromUrl,
  xmlToJson,
  categories
};
// export default fetchHtmlFromUrl;
