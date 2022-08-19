const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var db;
MongoClient.connect('mongodb+srv://song0726:song033634120@cluster0.jkh1uqu.mongodb.net/?retryWrites=true&w=majority', function(err, client){
   if(err) return console.log(err);

   db = client.db('DailySchedule');

   app.listen('8080', function(){
      console.log('listening 8080~');
   })
})

app.get('/', function(req, res){
   res.sendFile(__dirname + '/index.html');
});

app.get('/write', function(req, res){
   res.sendFile(__dirname + '/write.html');
});

app.post('/add', function(req, res){   
   db.collection('counter').findOne({name : '일정갯수'}, function(err, result){
      var cnt = result.total;

      db.collection('study').insertOne({_id : cnt+1, goal : req.body.goal, content : req.body.content}, function(err, result){
         db.collection('counter').updateOne({name : '일정갯수'}, {$inc : {total : 1}}, function(err, result){
            if(err) return console.log(err);
            res.send('전송완료~')
         });
      });
   })
});

app.get('/list', function(req, res){
   db.collection('study').find().toArray(function(err, result){
      console.log(result);
      res.render('list.ejs', {data : result});
   })
});