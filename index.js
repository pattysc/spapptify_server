var express = require('express')
var axios = require('axios')
var cors = require('cors')
var querystring = require('querystring')
var app = express()

var port = process.env.PORT || 8080

app.use(cors())

var auth = {
  method: 'POST',
  url: 'https://accounts.spotify.com/api/token',
  data: querystring.stringify({
    grant_type: 'client_credentials'
  }),
  headers: {
    'Authorization': 'Basic ' + (Buffer('41929642bc364b3f9d6a1e261b36cc87:5393e8db6e4c4d1abba9364760ab2463').toString('base64')),
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  json: true
}
var token = "Bearer "

app.get('/auth', function(req, res){
  axios(auth).then(
    function(data){
      res.json({message: 'yay'})
      token += data.data.access_token
    }
  ).catch(function(data){
    console.log(data)
    res.json({message: 'something went wrong :('})
  })
})

function playlist(ids, token){
  return {method: 'GET',
  url: `https://api.spotify.com/v1/recommendations?seed_artists=${ids}`,
  headers: {
    'Authorization': token,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  json: true}
}

app.get('/make', function(req, res){
  console.log('in /make get');
  let ids = req.query.ids
  axios(playlist(ids, token)).then(
    function(data){
      console.log(data);
      res.send(data.data)
    }
  ).catch(function(data){
    console.log(data)
    res.json({message: "didn't work"})
  })
})

app.listen(port)
