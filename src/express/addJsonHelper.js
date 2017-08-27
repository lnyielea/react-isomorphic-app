/**
 * @author lnyi <lnyielea@gmail.com>
 */

export default (app) => {
  function getJsonHelper(res) {
    return {
      out(code, message, data) {
        const jsonData = {
          code,
          message,
          data
        };
        res.end(JSON.stringify(jsonData));
      },

      success(data) {
        this.out(1, '', data);
      },

      error(code, message) {
        let codeValue;
        let messageValue;

        codeValue = code;
        messageValue = message;
        if (arguments.length === 1) {
          messageValue = codeValue;
          codeValue = 0;
        }
        this.out(codeValue, messageValue);
      }
    };
  }
  app.use(
    (req, res, next) => {
      const jsonHelper = getJsonHelper(res);
      res.json = jsonHelper;
      next();
    }
  );
};
