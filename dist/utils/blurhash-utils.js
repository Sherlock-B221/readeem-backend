"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeImageToBlurhash = exports.getImageData = exports.loadImage = void 0;
const blurhash_1 = require("blurhash");
const loadImage = async (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (...args) => reject(args);
    img.src = src;
});
exports.loadImage = loadImage;
const getImageData = (image) => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, image.width, image.height);
};
exports.getImageData = getImageData;
const encodeImageToBlurhash = async (imageUrl) => {
    const image = await exports.loadImage(imageUrl);
    const imageData = exports.getImageData(image);
    return blurhash_1.encode(imageData.data, imageData.width, imageData.height, 4, 4);
};
exports.encodeImageToBlurhash = encodeImageToBlurhash;
