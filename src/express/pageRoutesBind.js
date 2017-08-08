/**
 * @author lnyi <lnyielea@gmail.com>
 */
import pageRoutes from "../routesConfig"
export default function(app, o) {
  pageRoutes.map((config) => {
    let routePath;

    if(typeof config == "object") {
      routePath = config.path;
    }
    else {
      routePath = `/${config}`;
    }
    try {
      // include controller file
      app.get(routePath, require('../controller/${routePath}')["default"])
    }
    catch(e) {
      // on error, nonexistence controller file, render default page
      app.get(routePath, (req, res) => {
        res.render("index.html");
      })
    }
  });
}
