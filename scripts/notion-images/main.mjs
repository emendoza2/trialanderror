import { exec } from "child_process";
import { fstat } from "fs";
import { writeFile } from "fs/promises";
import { extname } from "path";
import sharp from "sharp";

const extensions = ["jpg", "jpeg", "png", "webp", "avif", "tiff", "gif"];
const maxWidth = 1500;

const { stdout } = await new Promise((resolve, reject) =>
    exec("git status --porcelain -su src/posts", (err, stdout, stderr) => {
        if (err) return reject(err);
        resolve({ stdout, stderr });
    })
);

function also(cb, ...cbs) {
    return (...args) => (cbs.forEach((c) => c(...args)), cb(...args));
}

const imagePaths = stdout
    .split("\n")
    .map((line) => line.slice(3))
    .filter((path) => extensions.includes(extname(path).slice(1)));

const asyncFilter = async (arr, predicate) =>
    Promise.all(arr.map(predicate)).then((results) =>
        arr.filter((_v, index) => results[index])
    );

const imagePromises = (
    await asyncFilter(
        imagePaths.map((path) => [sharp(path), path]),
        async ([image]) => (await image.metadata()).width > maxWidth
    )
).map(async ([image, path]) => {
    const buf = await image
        .resize({
            width: maxWidth,
            fit: sharp.fit.contain,
            withoutEnlargement: true,
        })
        .toBuffer();
    await sharp(buf).toFile(path);
    console.log("Resized", path);
});
// .map(image => ImageBuffer.from_buffer(image.toBuffer()).) // and optim while we're at it [CANT - WINDOWS]

if (!imagePromises.length) console.log("Nothing to resize")
await Promise.all(imagePromises);