"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_middleware_1 = __importDefault(require("./middlewares/auth.middleware"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const board_routes_1 = __importDefault(require("./routes/board.routes"));
const card_routes_1 = __importDefault(require("./routes/card.routes"));
const group_routes_1 = __importDefault(require("./routes/group.routes"));
const index_1 = require("./databases/index");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/auth', auth_routes_1.default);
app.use('/board', board_routes_1.default);
app.use('/card', card_routes_1.default);
app.use('/group', group_routes_1.default);
app.use(error_middleware_1.validationError);
app.use(error_middleware_1.unknownError);
app.use(auth_middleware_1.default);
app.listen(process.env.port, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, index_1.connectToDb)()
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`http://127.0.0.1:${process.env.port || 1708} is listening...`);
    }));
}));
// Asymmetric Algorithm
// const { publicKey, privateKey, } = generateKeyPairSync("rsa", {
//   modulusLength: 2048,
// })
// const encryptedText = publicEncrypt({
//   key: publicKey,
//   padding: constants.RSA_PKCS1_OAEP_PADDING,//optional
//   oaepHash: 'sha256'//optional
// },
//   Buffer.from("sefa")
// )
// const decryptedText = privateDecrypt(
//   {
//     key: privateKey,
//     padding: constants.RSA_PKCS1_OAEP_PADDING,//optional
//     oaepHash: 'sha256'//optional
//   },
//   encryptedText
// )
// console.log(encryptedText.toString('base64'))
// console.log('decrypted text:', decryptedText.toString())
