// See http://brunch.io for documentation.
const path = require("node:path");
const paths = {
  public: "public", // output folder
  watched: ["app"], // ask brunch to watch this folder
};

const files = {
  javascripts: {
    joinTo: {
      "js/app.js": "app/*.js",
      "js/vendor.js": [/^node_modules/, /^vendor/],
    },
  },
  stylesheets: {
    joinTo: {
      "css/main.css": /^app\/styles/,
      "css/vendor.css": [/^node_modules/, /^vendor/],
    },
  },
};

// make those variables available to the browser window object
const npm = {
  enabled: true,
  globals: {
    $: "jquery",
    jQuery: "jquery",
    popper: "@popperjs/core",
    bootstrap: "bootstrap",
  },
};

const plugins = {
  on: ["postcss-brunch", "terser-brunch"], // these plugins will always run!
  off: [],
  babel: {
    ignore: [/node_modules/],
    presets: [
      [
        "@babel/preset-env",
        {
          debug: false,
          useBuiltIns: "usage",
          corejs: { version: "3.25.5", proposals: true },
        },
      ],
    ],
  },
  postcss: {
    pattern: /\.s?css$/i,
    processors: [require("autoprefixer")],
    options: {
      parser: require("postcss-scss"),
    },
  },
  sass: {
    mode: "native",
    sourceMapEmbed: true,
    debug: "comments",
  },
  pug: {
    locals: { name: "Ann" },
    pugRuntime: false, // not included to vendor.js
    staticPretty: true, // don't minify the output
  },
  terser: {
    mangle: false,
    compress: {
      global_defs: {
        DEBUG: false,
      },
    },
    ignored: [/app\.js/], // don't minify these js in production
  },
  // remove this plugin when css is broken
  purgecss: {
    paths: [
      path.resolve("./app/assets/*.pug"),
      path.resolve("./app/assets/*.html"),
    ],
    extractors: [
      {
        extractor: class {
          static extract(content) {
            return content.match(/[A-z0-9-:\/]+/g) || [];
          }
        },
        extensions: ["html", "pug"],
      },
    ],
  },
};

const modules = {
  nameCleaner: (path) => path.replace(/^app\//, ""),
  autoRequire: {
    "js/app.js": ["init"],
  },
  // wrapper: false,
  // definition: false,
};

const overrides = {
  production: {
    optimize: false,
    sourceMaps: false,
    plugins: { autoReload: { enabled: false } },
    // paths: {
    //   public: "dist",
    // },
  },
};

const server = {
  hostname: "127.0.0.1",
  port: 4321,
};

const sourceMaps = "absoluteUrl";

// Extending Config
const standaloneScripts = ["about.js"];
const standaloneScriptsDir = "app/scripts/";

for (const filename of standaloneScripts) {
  const outputPath = "js/" + filename;
  files.javascripts.joinTo[outputPath] = standaloneScriptsDir + filename;
  modules.autoRequire[outputPath] = [
    standaloneScriptsDir.replace("app/", "") + filename,
  ];
  plugins.terser.ignored.push(`public/js/` + filename); // don't minify this in production
}

module.exports = {
  paths,
  files,
  npm,
  plugins,
  modules,
  overrides,
  server,
  sourceMaps,
};
