var express = require('express');
var app = express(); 
var url ="mongodb://localhost:27017/urlshortener";

var mongo = require('mongodb').MongoClient;
var resultF="null";

function shortUrl(urlparam){
    
mongo.connect(url, function(err, db) {
    
        if (err) throw err;
         function getNextSequenceValue(sequenceName){
           var sequenceDocument = db.url_count.findAndModify({
              query:{_id: sequenceName },
              update: {$inc:{sequence_value:1}},
              new:true
           });
           return sequenceDocument.sequence_value;
        } 



   var collection = db.collection('urls', function(err, collection) {
      if (err) throw err;
      var result = collection.find( { oroginalurl: urlparam });
      if(result!==undefined) { 
           resultF ="find"+JSON.stringify(result[0]);
      }else{
          collection.insert({
                "_id":getNextSequenceValue("urlid"),
                "oroginalulr":urlparam
            }, function(err,records){
                if(!err){
                resultF = records.ops[0]._id}
                 })
            }
      }); 
    
    db.close();
    return resultF;
    })}

app.get('/new/:url', function (req, res) {
    var par = req.param("url");
    var shorturlReturn = shortUrl(url);//return id ut of mongo
  res.json({
      oroginalulr:par,
      shorturl:par + "-"+shorturlReturn
    });
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});