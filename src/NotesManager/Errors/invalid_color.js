"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.InvalidColor = void 0;
var basic_error_1 = require("./basic_error");
var InvalidColor = /** @class */ (function (_super) {
    __extends(InvalidColor, _super);
    function InvalidColor(invalidColor) {
        var _this = _super.call(this, "Can't recognize color " + invalidColor + " !") || this;
        _this.invalidColor = invalidColor;
        return _this;
    }
    InvalidColor.prototype.toString = function () {
        return _super.prototype.color.call(this, _super.prototype.toString.call(this));
    };
    return InvalidColor;
}(basic_error_1.BasicError));
exports.InvalidColor = InvalidColor;
