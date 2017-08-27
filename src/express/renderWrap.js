/**
 * @author lnyi <lnyielea@gmail.com>
 */

import url from 'url';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import Routes from '../routes';
import routesConfig from '../routesConfig';

let fileMap;

if (process.env.NODE_ENV === 'production') {
  /* eslint-disable global-require */
  fileMap = require('../static/fileMap');
  /* eslint-enable global-require */
}

function getResources(fileList) {
  const resources = {
    js: [],
    css: []
  };
  const pattern = /\.([^.]*)$/;
  if (fileList) {
    fileList.map((file) => {
      const match = file.match(pattern);
      const type = match[1];
      switch (type) {
        case 'js': case 'css':
          resources[type].push(file);
          break;
        default: return null;
      }
      return null;
    });
  }
  return resources;
}

function getResourceAndFileMap(pathname) {
  let filepathName;

  filepathName = pathname;
  if (filepathName === '/') {
    filepathName = '/index';
  }
  filepathName = url.parse(filepathName).pathname.substring(1);

  if (process.env.NODE_ENV !== 'production') {
    /* eslint-disable global-require */
    fileMap = require('../static/fileMap');
    /* eslint-enable global-require */
  }
  routesConfig.map(
    (route) => {
      if (typeof route === 'object') {
        if (filepathName === route.path) {
          filepathName = route.resourcePath;
        }
      }
      return null;
    }
  );
  const filePath = `/src/pages/${filepathName}.jsx`;
  const fileList = fileMap[filePath];
  const resources = getResources(fileList);
  return {
    resources,
    fileMap
  };
}

export default (req, res, next) => {
  const render = res.render;
  res.render = (renderFile, data = {}) => {
    const resourceAndFileMap = getResourceAndFileMap(req.url);
    const { resources } = resourceAndFileMap;

    const outFileMap = {};
    const renderData = data;

    fileMap = resourceAndFileMap.fileMap;

    Object.keys(fileMap).forEach((key) => {
      if (key.indexOf('page') !== -1 && key.indexOf('.jsx') !== -1) {
        outFileMap[key] = fileMap[key];
      }
    });
    try {
      /* eslint-disable no-underscore-dangle, react/jsx-filename-extension */
      renderData.__mod = resources;
      renderData.__app = getResources(fileMap.app);
      renderData.__vendors = getResources(fileMap.vendors);
      renderData.__manifest = getResources(fileMap.manifest);
      renderData.__outFileMap = JSON.stringify(outFileMap || '');
      console.log(renderData.__mod);
      if (renderData.__mod.js.length) {
        renderData.__html = ReactDOMServer.renderToString(
          <StaticRouter location={req.url} context={{}}><Routes /></StaticRouter>);
      }
      /* eslint-enable no-underscore-dangle, react/jsx-filename-extension */
    } catch (e) { console.log(e); }
    render.call(res, renderFile, data);
  };
  next();
};
