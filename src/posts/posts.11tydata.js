module.exports = { layout: "post", tags: "post", eleventyComputed: {
    image: "https://trialanderror-og-image.vercel.app/{{ title | urlencode }}.png?theme=dark&md=1&fontSize=125px&images=https%3A%2F%2Fblog.elijahmendoza.nom.za%2Fbrand%2Flogo-dark-transparent.svg"
    // juan: data => (data.content) ? console.log("Content", excerpt) : console.log("Chinese content", data)
} }