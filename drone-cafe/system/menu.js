const system = require("./system.js");
mongoClient = system.mongoClient;
mongodb = system.mongodb;

function getMenuAll() {
    return new Promise((done, fail)=>{
        mongoClient.connect(system.url, function(err, db){
            if (err) {
                fail(err);
            }
            else {
                let collection = db.collection("menu");
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
    })
}
function getMenu(idItem) {
    return new Promise((done, fail)=>{
        mongoClient.connect(system.url, function(err, db){
            if (err) {
                fail(err);
            }
            else {
                let collection = db.collection("menu");
                collection.find({id: idItem}, function(err, cursor) {
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
    })
}
module.exports = {getMenu, getMenuAll};