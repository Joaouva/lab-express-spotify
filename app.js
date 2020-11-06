require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req,res) => {
    res.render('index');
});

app.get('/artist-search', (req, res) => {
  console.log(req.query)
  spotifyApi
      .searchArtists(req.query.artist)
      .then(data => {

          console.log('The received data from the API: ', data.body);

          console.log('The received data from the API: ', data.body.artists.items);

          res.render('artist-search-results', { artistsArray: data.body.artists.items })
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
    });

    app.get('/albums/:artistId', (req, res) => {
      console.log(req.params)
  
      spotifyApi.getArtistAlbums(req.params.artistId)
      .then(data => {
          console.log('Artist albums', data.body);
          res.render('albums', { artistsArray: data.body.items })
      })
      .catch (err => console.log('The error while searching artists occurred: ', err));
  });

  app.get('/tracks/:albumId', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.albumId, { limit: 5, offset: 1 })
        .then(tracks => {
            console.log(tracks.body.items);
            res.render('tracks', {tracks: tracks.body.items});
        })
        .catch((err) => {
            console.log('Something went wrong!', err);
        })
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
