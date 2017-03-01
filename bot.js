var Twit = require('twit');
var fs = require('fs');

var today = new Date();
var today_date = today.getUTCDate();
var month = today.getUTCMonth();
var year = today.getUTCFullYear();
var reg_indicator = "reg_tweet_botsinnumbers";

var config = require('./config');
var T = new Twit(config);

setInterval(daySummaryReport, 43200000);
daySummaryReport();

var stream = T.stream('statuses/filter', { track: '@botsinnumbers' })
stream.on('tweet', function (tweet) {
  for(i = 0 ; i < tweet.entities.user_mentions.length ; i++){
    if(tweet.entities.user_mentions[i].screen_name != "botsinnumbers"){
      var to_user = tweet.user.screen_name;
      getTweets(tweet.entities.user_mentions[i].screen_name , to_user);
    }
  }
  // fs.writeFileSync("streamData.json", JSON.stringify(tweet, null, 2));
})


function daySummaryReport(){
  var bot_list = JSON.parse(fs.readFileSync("bot_list.json"));
  for(j = 0; j < bot_list.length ; j++){
    getTweets(bot_list[j].bot_name, reg_indicator);
  }
}

function getTweets(bot_name, to_user){
  T.get('statuses/user_timeline', { screen_name: bot_name, count: 200},  function (err, data, response) {
    if(err) {console.log(err)}
    else{
      data = extractToday(data);
      createRegularTweet(data, bot_name, to_user);
      // fs.writeFileSync(bot_name + ".json", JSON.stringify(data, null, 2));
    }
  })
}

function createRegularTweet(data, bot_name, to_user){
  var new_status = {};
  new_status.bot_name = bot_name;
  new_status.statuses = data.length;
  new_status.retweets = 0;
  new_status.favorited = 0;
  for (k = 0 ; k < data.length ; k++){
    if(data.length != 0){
      new_status.retweets += data[k].retweet_count;
      new_status.favorited += data[k].favorite_count;
    }
    else {
      new_status.retweets = 0;
      new_status.favorited = 0;
    }
  }
  if(to_user != reg_indicator){
    new_status.text = "For @" + to_user + "\n" + "@" + bot_name + "\n" + numerify(new_status.statuses) + " new tweets" + "\n" + numerify(new_status.retweets) + " times got retweeted" + "\n" + numerify(new_status.favorited) + " times got favorited" + "\n\n" + "-" + today_date + " " + monthify(month) + " " + year;
  }
  else {
    new_status.text = "@" + bot_name + "\n" + numerify(new_status.statuses) + " new tweets" + "\n" + numerify(new_status.retweets) + " times got retweeted" + "\n" + numerify(new_status.favorited) + " times got favorited" + "\n\n" + "-" + today_date + " " + monthify(month) + " " + year;
  }
  // status.push(new_status);
  tweetit(new_status.text);
}

function tweetit(new_status_text) {
    T.post('statuses/update', { status: new_status_text }, function(err, data, response) {
      if(err){console.log(err)}
  })
}


// SUPPORTING FUNCTIONS

function addToBotList(data, bot_name) {
  var new_bot = {};
  var exist;
  new_bot.bot_name = bot_name;
  new_bot.followers = data[0].user.followers_count;
  var bot_list = JSON.parse(fs.readFileSync("bot_list.json"));
  for(m = 0 ; m < bot_list.length ; m++){
    if(bot_list[m].bot_name == bot_name){
       exist = 1;
    }
  }
  if(!exist){
    bot_list.push(new_bot);
    fs.writeFileSync("bot_list.json", JSON.stringify(bot_list, null, 2));
  }
  else{
    console.log("bot exists already");
  }
}

function extractToday(data){
  for(i = 0 ; i < data.length ; i++){
    var tweet_date = Number(data[i].created_at.split(" ")[2]);
    if(tweet_date != today_date){
      if(i != 0){
        data.splice(i, data.length-1);
        i = data.length;
      }
      else{
        data = [];
      }
    }
  }
  return data;
}

function monthify(month){
  switch(month){
    case 0:
      return 'Jan'
      break;
    case 1:
      return 'Feb'
      break;
    case 2:
      return 'Mar'
      break;
    case 3:
      return 'Apr'
      break;
    case 4:
      return 'May'
      break;
    case 5:
      return 'Jun'
      break;
    case 6:
      return 'Jul'
      break;
    case 7:
      return 'Aug'
      break;
    case 8:
      return 'Sept'
      break;
    case 9:
      return 'Oct'
      break;
    case 10:
      return 'Nov'
      break;
    case 11:
      return 'Dec'
      break;
    default:
      return month;
  }
}

function numerify(num){
  if(num < 10){
    return "0" + String(num);
  }
  else {return num};
}

// @earthquakeBot 12 May 2017
// new statuses: x , retweets: x, favorited: x, new followers: x
