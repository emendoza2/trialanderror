const mix = require("laravel-mix");
require("laravel-mix-esbuild");

const tailwind = require("tailwindcss")("./tailwind.config.js");
const assets = require("./_data/assets.json");

assets.js.reduce((mix, asset) => mix.js(asset, "js").esbuild(), assets.css
    .reduce((mix, asset) => mix.css(asset, "css", [tailwind]).version(), mix))
    .setPublicPath("_site")
    .disableNotifications();
