var app = require('express')();
var http = require('http').Server(app);
var fs = require('fs');
var bodyParser = require('body-parser');

//use body parser to read POST
app.use(bodyParser.urlencoded({extended: false}));


http.listen(3000, function(){
    
  console.log('listening on *:3000');
});

///////////////////////////////////////////////////////////////////
//////////////////////////Image handler//////////////////////////////////
app.get('/hand1.png', function(req, res){    
    res.sendFile(__dirname + '/hand1.png');
});
app.get('/hand2.gif', function(req, res){     
    res.sendFile(__dirname + '/hand2.gif');
});
/////////////////////////////////////////////////////////////////
//////////////////Roots///////////////////////////////////////////
app.get('/', function(req, res){     
  console.log("root");
    res.sendFile(__dirname + '/root.html');
});
///////////////////////////////////////////////////////////////
///////////////////CSS handler///////////////////////////////////
app.get('/game.css', function(req, res){     
 
    res.sendFile(__dirname + '/game.css');
});
////////////////////////////////////////////////////////////////
////////////////////leaderboard/////////////////////////////
app.get('/leaderBoard', function(req, res){    
 
    res.sendFile(__dirname + '/leaderBoard.html');
});
app.get('/userNameDataBase.json', function(req, res){    
 
    res.sendFile(__dirname + '/userNameDataBase.json');
});
/////////////////////////////////////////////////////////////
//////////////////////////////UserName//////////////////////
app.post('/start', function(req, res){   
    var currentUserFlag = true;
    var rawJSON = fs.readFileSync("userNameDataBase.json");
    var parsedJSON = JSON.parse(rawJSON);
    for(var entry in parsedJSON.userNameData) {                 
        if(entry == req.body.user) {    
            currentUserFlag = false;
        }
    }
    if(currentUserFlag) {
    parsedJSON.userNameData[req.body.user] = {"score": 0, "timeStart": "default"};
    }
    fs.writeFileSync('userNameDataBase.json', JSON.stringify(parsedJSON, null, '\t'));
   
    
    res.sendFile(__dirname + '/start.html');
});
////////////////////////////////////////////////////////////
////////////////////Gameplay///////////////////////////////
app.get('/gamePlay', function(req, res){    

    res.sendFile(__dirname + '/gamePlay.html');
});
app.post('/gamePlay', function(req, res){    
    //Only for time recording//////////////////////////////////////////////
    var rawJSON = fs.readFileSync("userNameDataBase.json");
    var parsedJSON = JSON.parse(rawJSON);
    var timeStart = new Date();
    var time = timeStart.getHours() + " " + timeStart.getMinutes() + " " + timeStart.getSeconds();
    console.log(req.body);    
    parsedJSON.userNameData[req.body.user].timeStart = time;
   
    fs.writeFileSync('userNameDataBase.json', JSON.stringify(parsedJSON, null, '\t'));
    res.sendFile(__dirname + '/gamePlay.html');
});
app.get('/sentence.json', function(req, res){ 
    var text = fs.readFileSync("BillOfRights.txt", "utf-8"); 
    var lines = text.split('\n');
    var index = Math.floor(Math.random() * (lines.length - 1));
    var rawJSON = fs.readFileSync("sentence.json");
    var parsedJSON = JSON.parse(rawJSON); 
    parsedJSON.sentence = lines[index];
    fs.writeFileSync('sentence.json', JSON.stringify(parsedJSON, null, '\t'));

    res.sendFile(__dirname + '/sentence.json');
});
app.post('/gameComplete', function(req, res){    
    console.log(req.body);
    //Record time, get userName, calcualte score//////////////////////////////////////
    //change score, then require page to request json file, move sentence to JSON////////////////////////////////Also write gameComplete page where score is displayed to user.
    //to play new game make post request to start, also add link to go back to leaderboard
    res.sendFile(__dirname + '/gameComplete.html');
});
///////////////////////////////////////////////////////////////////
