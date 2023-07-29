const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const axios = require('axios');
const cheerio = require('cheerio');
const fmovies = require('./fmovies');
const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

const builder = new addonBuilder({
    id: 'stremio-http-frog',
    version: '0.0.1',
    name: 'http frog gathers illicit http sources',
    resources: ['stream'],
    catalogs: [], // Add an empty array for catalogs
    types: ['movie', 'series'],
    idPrefixes: ['tt'],
});

// Function to fetch title information from cinemeta plugin
async function fetchTitleFromCinemeta(imdbId) {
    const cinemetaBaseUrl = 'https://cinemeta.strem.io/meta';
    const apiUrl = `${cinemetaBaseUrl}/${imdbId}.json`;

    try {
        const response = await axios.get(apiUrl);
        const title = response.data.name; // Get the title from the cinemeta response
        return title;
    } catch (error) {
        console.error('Error fetching title information from cinemeta:', error.message);
        return null;
    }
}

// Inside the defineStreamHandler function
builder.defineStreamHandler(async function(args) {
    // Get the requested type and ID from the args object
    const { type, id } = args;

    // Check if the requested type is either 'movie' or 'series'
    if (type === 'movie' || type === 'series') {
        // Fetch title information from cinemeta using the IMDb ID
        const title = await fetchTitleFromCinemeta(id);
        if (!title) {
            console.error('Failed to fetch title information from cinemeta.');
            return Promise.resolve({ streams: [] });
        }

        // Log the IMDb ID and title for demonstration purposes
        console.log(`Selected ${type} IMDb ID: ${id}, Title: ${title}`);

        // Now you can use the title to perform the search on the site you're scraping from.
        const streams = await fmovies(title, axios, cheerio);

        return Promise.resolve({ streams: streams }); // Return the stream sources obtained from the search

    } else {
        // If the requested type is neither 'movie' nor 'series', return an empty array.
        return Promise.resolve({ streams: [] });
    }
});

serveHTTP(builder.getInterface(), { port: 7000 });
