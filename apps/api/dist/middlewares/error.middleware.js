"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorMiddleware;
function errorMiddleware(err, req, res, next) {
    res.status(500).send({
        message: err.message,
    });
}
;
