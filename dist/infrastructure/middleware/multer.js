"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
        return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
};
const fileSizeLimit = 5 * 1024 * 1024;
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: fileSizeLimit }
});
exports.default = upload;
