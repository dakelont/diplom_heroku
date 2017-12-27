const mongodb = require("mongodb");

const mongoClient = mongodb.MongoClient;

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require("body-parser");

const sess={};
/* const url = "mongodb://localhost:27017/cafe1"; */
const url = "mongodb://heroku_kqt4ln18:heroku_kqt4ln181@ds133017.mlab.com:33017/heroku_kqt4ln18";

function findOrderCtatus (data,status) {
    return data.map(function(item) {
        item.status = status.find(function(n) {
            return n.id==item.status;
        })
        return item;
    });
}
function getAllDataMongo(collectionName) {
    return new Promise((done, fail)=>{
        mongoClient.connect(url, function(err, db){
            if (err) {
                fail(err);
            }
            else {
                let collection = db.collection(collectionName);
                collection.find({}, function(err, cursor) {
                    cursor.toArray(function(err, items) {
                        if (err) fail(err);
                        else {
                            done(items);
                        }
                    });
                 });
            }
            db.close();
        });
    });
}

function changeOrderCtatus(_id, statusId) {
    return new Promise((done, fail)=>{
        mongoClient.connect(url, function(err, db){
            if (err) {
                fail(err);
            }
            else {
                let collection = db.collection("Basket");
                collection.update({
                    _id: new mongodb.ObjectID(_id)
                },
                {$set: {status:statusId}}, 
                function(err, res) {
                    done(res.result.ok);
                });
        }
            db.close();
        });
    });
}
function clearBasket(_id) {
    return new Promise((done, fail)=>{
        mongoClient.connect(url, function(err, db){
            if (err) {
                fail(err);
            }
            else {
                let collection = db.collection("Basket");
                collection.deleteOne({
                    _id: new mongodb.ObjectID(_id)
                },
                function(err, res) {
                    console.log("res.result",res.result);
                    done(res.result.ok);
                });
        }
            db.close();
        });
    });
}
module.exports={findOrderCtatus, getAllDataMongo, changeOrderCtatus, clearBasket, sess, url, app, http, io, bodyParser, mongodb, mongoClient};