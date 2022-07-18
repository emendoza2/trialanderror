const mix = require("laravel-mix");
require("laravel-mix-esbuild");

const tailwind = require("tailwindcss")("./tailwind.config.js");
const assets = {
    css: ["assets/css/post.css", "assets/css/styles.css"],
    js: ["assets/js/scripts.js"],
};

assets.css
    .reduce((mix, asset) => mix.css(asset, "css", [tailwind]), mix)
    .js(assets.js, "js")
    .esbuild()
    .setPublicPath("_site")
    .disableNotifications();
