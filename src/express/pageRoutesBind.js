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
      // 如果该路由存在controller，引入路由
      app.get(routePath, require('../controller/${routePath}')["default"])
    }
    catch(e) {
      // 如果发生错误，说明该路由不存在对应的controller。直接通过index.html渲染
      app.get(routePath, (req, res) => {
        res.render("index.html");
      })
    }
  });
}
