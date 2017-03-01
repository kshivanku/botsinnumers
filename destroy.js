var Twit = require('twit');

var T = new Twit({
  consumer_key:         'R0n1pWrWX5GKk4gpYWW6uPkrH',
  consumer_secret:      'y56qxVqWPiOixERg3JISC41UeGBfUIakge1sudyHO0zpcV8xVj',
  access_token:         '836571647549321216-ptv5BGc0B5EUAqtxVvKYglMGQaUoBPT',
  access_token_secret:  'Gt2G2fdkFAYFzNZm16oxN1fVMff3gOFKcDXVgmF5X3U6A',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

T.get('statuses/user_timeline', { screen_name: 'botsinnumbers', count: 200},  function (err, data, response) {
  if(err) {console.log(err)}
  else{
    for(i = 0; i < data.length; i++){
      destroy(data[i].id_str);
    }
    console.log("deleted all tweets");
  }
})

function destroy(id){
    T.post('statuses/destroy/:id', { id: id }, function (err, data, response) {
      if(err) {console.log(err)}
    })
}
