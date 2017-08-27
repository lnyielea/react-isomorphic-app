/**
 * @author lnyi <lnyielea@gmail.com>
 */

export default [
  {
    method: 'get',
    path: '/test',
    handler(req, res) {
      res.json.success('request success');
    }
  }
]
