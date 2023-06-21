"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordChangeEnum = exports.MfaStatusEnum = exports.MfaEnum = exports.BaseStatusEnum = void 0;
var BaseStatusEnum;
(function (BaseStatusEnum) {
    BaseStatusEnum[BaseStatusEnum["Passive"] = 0] = "Passive";
    BaseStatusEnum[BaseStatusEnum["Active"] = 1] = "Active";
})(BaseStatusEnum = exports.BaseStatusEnum || (exports.BaseStatusEnum = {}));
var MfaEnum;
(function (MfaEnum) {
    MfaEnum[MfaEnum["Email"] = 0] = "Email";
    MfaEnum[MfaEnum["GoogleAuth"] = 1] = "GoogleAuth";
})(MfaEnum = exports.MfaEnum || (exports.MfaEnum = {}));
var MfaStatusEnum;
(function (MfaStatusEnum) {
    MfaStatusEnum[MfaStatusEnum["NotUsed"] = 0] = "NotUsed";
    MfaStatusEnum[MfaStatusEnum["Correct"] = 1] = "Correct";
    MfaStatusEnum[MfaStatusEnum["Wrong"] = 2] = "Wrong";
})(MfaStatusEnum = exports.MfaStatusEnum || (exports.MfaStatusEnum = {}));
var PasswordChangeEnum;
(function (PasswordChangeEnum) {
    PasswordChangeEnum[PasswordChangeEnum["Change"] = 0] = "Change";
    PasswordChangeEnum[PasswordChangeEnum["Forgetten"] = 1] = "Forgetten";
})(PasswordChangeEnum = exports.PasswordChangeEnum || (exports.PasswordChangeEnum = {}));
