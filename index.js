const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');

const { ConfigPage, getConfig } = require("./configstreams"); // Import from configstreams.js

const manifest = {
    id: 'http-frog',
    version: '0.0.1',
    name: 'HTTP frog',
    description: 'HTTP frog retrieves http streams from various sources',
    resources: ['catalog', 'stream'],
    types: ['movie', 'series'],
    idPrefixes: ['tt'] // Prefix for IMDb IDs
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(args => {
    // Your catalog logic here
    return Promise.resolve({ catalogs: [] });
});

builder.defineStreamHandler(args => {
    // Your stream logic here
    return Promise.resolve({ streams: [] });
});

// Define your configurator
builder.defineConfigurator(({ addonInterface, setOptions }) => {
    const options = getConfig();
    const configPage = ConfigPage();
  
    // Listen for changes in configuration
    configPage.addEventListener("change", (event) => {
      options.fmovies = event.target.checked;
      setOptions(options);
    });
  
    return Promise.resolve({ page: configPage });
  });

serveHTTP(builder.getInterface(), { port: 7000 });
