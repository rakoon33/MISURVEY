const { createNamespace } = require('cls-hooked');

// Tạo một namespace
const namespace = createNamespace('MiSurveyApp');

const clsMiddleware = (req, res, next) => {
    if (req.user) {
      console.log("Setting user in CLS", req.user);
      namespace.run(() => {
        namespace.set('user', req.user);
        next();
      });
    } else {
      console.log("No user found in request");
      next();
    }
  };
  

module.exports = {
  clsMiddleware,
  namespace  
};
