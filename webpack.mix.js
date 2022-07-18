const mix = require("laravel-mix");
require("laravel-mix-esbuild");

const tailwind = require("tailwindcss")("./tailwind.config.js");
const assets = {
    css: ["assets/css/post.css", "assets/css/styles.css"],
    js: ["assets/js/scripts.js", "assets/js/post.js"],
};

assets.js.reduce((mix, asset) => mix.js(asset, "js").esbuild(), assets.css
    .reduce((mix, asset) => mix.css(asset, "css", [tailwind]).version(), mix))
    .setPublicPath("_site")
    .disableNotifications();
