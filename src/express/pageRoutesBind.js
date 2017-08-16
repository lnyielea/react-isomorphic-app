/**
 * @author lnyi <lnyielea@gmail.com>
 */

import pageRoutes from "../routesConfig"

export default function(router, bindedControllerCache) {
  pageRoutes.map((config) => {
    let routePath;

    if(typeof config == "object") {
      routePath = `/${config.path}`;
    }
    else {
      routePath = `/${config}`;
    }
    if(routePath == "//") {
      routePath = "/";
    }
    // if can't have controller, bind default;
    if(!bindedControllerCache[routePath]) {
      router.get(routePath, (req, res) => {
        res.render("index.html");
      })
    }
  });
}
