"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
class Utils {
    static getErrorMessages(errors) {
        let errorTexts = [];
        if (errors.length > 0) {
            for (const errorItem of errors) {
                if (errorItem.constraints) {
                    const keys = Object.keys(errorItem.constraints);
                    for (const key of keys) {
                        errorTexts = errorTexts.concat(errorItem.constraints[key]);
                    }
                }
            }
        }
        return errorTexts;
    }
}
exports.Utils = Utils;
//# sourceMappingURL=index.js.map