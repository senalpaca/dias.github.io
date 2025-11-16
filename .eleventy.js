module.exports = function(eleventyConfig) {
  // Copy static assets directly to the output
  eleventyConfig.addPassthroughCopy("assets");

  return {
    dir: {
      input: ".",       // where Eleventy looks for content
      output: "_site",  // where Eleventy outputs the built site
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
