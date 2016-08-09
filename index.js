var express = require('express');
var app = express();
var url = "mongodb://localhost:27017/urlshortener";

var mongo = require('mongodb').MongoClient;
var resultF = "null";


app.get('/',function(req, res) {
        res.json( {
                    start: "use" })
})
app.get('/:id',function(req, res) {
    var id_in = req.params.id;
    var id=parseInt(id_in);
    console.log("id: "+id_in)
    mongo.connect(url, function(err, db) {
            if (err) throw err;
                    db.collection('urls', function(err, collection) {
                        if (err) throw err;
                       console.log("id: "+id+ "-"+typeof id)
        
                        collection.find({
                                "_id": id
                        }).toArray(function(err, items) {
                                    if (err) throw err;
                                    
                                    if (JSON.stringify(items[0]) !== undefined) {
                                        res.redirect(items[0]["oroginalulr"]);
                                    }
                                    else {res.json(
                                            {
                                                    error: "no such id available"
                                            })}
                        })
                    });
    });
});

app.get('/new/:url(*)/', function(req, res) {
    var par = req.param("url");
    mongo.connect(url, function(err, db) {
            if (err) throw err;
                
db.collection('urls', function(err, collection) {
    if (err) throw err;

    collection.find({
        "oroginalulr": par
    }).toArray(function(err, items) {
            if (err) throw err;
            if (JSON.stringify(items[0]) !== undefined) {
                res.json({
                    oroginalulr: par,
                    shorturl: par + "-" + items[0]._id
                });
            }
            else {
        db.collection('url_count', function(err, collection) {
                if (err) throw err;
                collection.findAndModify({
                        _id: "urlid"
                    }, [['_id', "asc"]], {
                        $inc: {sequence_value: 1}
                    }, {new: true},
                    function(err, rec) {
                        if (err) throw err;
                         var newID = rec["value"]["sequence_value"];                       
        db.collection('urls', function(err, collection) {
                if (err) throw err;
                console.log("insert")
                collection.insert({
                        "_id": newID,
                        "oroginalulr": par
                    });
                    res.json({
                            oroginalulr: par,
                            shorturl: par + "-"+ newID
                        });
                
        })})})}})})});
                                 
});

app.listen(8080, function() {
    console.log('Example app listening on port 8080!');
});