const { constants } = require('../constants');

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch(statusCode){
    case constants.VALIDATION_ERROR:
        res.json({title:"Validation Failed", message: err.message, stackTrace: err.stackTrace });
        break;
    case constants.NOT_FOUND:
        res.json({title:"not found", message: err.message, stackTrace: err.stackTrace });
        break;
    case constants.UNAUTHARIZED:
        res.json({title:"Unauthorized", message: err.message, stackTrace: err.stackTrace });
        break;
    case constants.FORBIDEN:
            res.json({title:"Forbidden Error", message: err.message, stackTrace: err.stackTrace });
            break;
    case constants.SERVER_ERROR:
        res.json({title:"server Error", message: err.message, stackTrace: err.stackTrace });
        break;
    default:
        console.log('No Error All good');
        res.json({title:"server Error", message: err.message, stackTrace: err.stackTrace });
        break;
  }
};

module.exports = errorHandler;
