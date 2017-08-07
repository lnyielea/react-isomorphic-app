/**
 * @author lnyi <lnyielea@gmail.com>
 */

import React, {Component} from 'react'
import ReactDOMServer from 'react-dom/server'
import {StaticRouter} from 'react-router-dom'
import Routes from '../routes'

let fileMap;

if(process.env.NODE_ENV == "production") {
  fileMap = require('../static/fileMap');
}

function getResourceAndFileMap(url) {
  if(url == "/") {
    url = "/index";
  }

  if(process.env.NODE_ENV != "production") {
    fileMap = require('../static/fileMap');
  }
  const filePath = `/src/pages${url}.jsx`;
  const fileList = fileMap[filePath];
  const resources = getResources(fileList);
  return {
    resources,
    fileMap
  };
};

function getResources(fileList) {
  const resources = {
    js: [],
    css: []
  };
  const pattern = /\.([^\.]*)$/;
  fileList.map((file) => {
    const match = file.match(pattern);
    const type = match[1];
    switch(type) {
      case "js": case "css":
      resources[type].push(file);
    }
  });
  return resources;
}

export default (req, res, next) => {
  const render = res.render;
  res.render = function(renderFile, data) {
    const {resources, fileMap} = getResourceAndFileMap(req.url);
    let outFileMap = {};

    data = data || {};
    for(let k in fileMap) {
      if(k.indexOf("page") != -1 && k.indexOf(".jsx") != -1) {
        outFileMap[k] = fileMap[k];
      }
    }
    try {
      data.__mod = resources;
      data.__app = getResources(fileMap.app);
      data.__vendors = getResources(fileMap.vendors);
      data.__manifest = getResources(fileMap.manifest);
      data.__outFileMap = JSON.stringify(outFileMap || "");
      if(data.__mod.js.length) {
        data.__html = ReactDOMServer.renderToString(<StaticRouter location={req.url} context={{}}><Routes></Routes></StaticRouter>);
      }
    }
    catch(e) {console.log(e)}
    render.call(res, renderFile, data);
  }
  next();
};
