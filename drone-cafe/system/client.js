
/* const io = require('socket.io')(http); */

const menu = require("./menu.js");
const system = require("./system.js");
const addMany = require("./add-many.js");
const url = system.url;
app = system.app;
http = system.http;
io = system.io;
bodyParser= system.bodyParser;
mongoClient = system.mongoClient;
mongodb = system.mongodb;

function addUserClient(query) {
    return new Promise((done, fail)=>{
        mongoClient.connect(url, function(err, db){
            if (err) {
                fail(err);
            }
            else {
                let collection = db.collection("client");
                let q = {"name":query.data.name, "email":query.data.email, "many":100};
                collection.insertOne(q,
                    function(err, result) {
                        if (err) fail(err);
                        system.sess._id = result.ops[0]._id;
                        system.sess.name = result.ops[0].name;
                        system.sess.email = result.ops[0].email;
                        system.sess.many = result.ops[0].many;
                        done(result.ops[0]);
                    });

            }
            db.close();
        });
    });
}
function getUserClient(query) {
    return new Promise((done, fail)=>{
        mongoClient.connect(url, function(err, db){
            if (err) {
                fail(err);
            }
            else {
                let collection = db.collection("client");
                collection.find({
                    name: {$regex: query.data.name, $options: 'i'}, 
                    email:{$regex: query.data.email, $options: 'i'}
                }, function(err, cursor) {
                    cursor.toArray(function(err, items) {
                        /* console.log("items:",items); */
                        if (err) fail(err);
                        if (items.length==0) done(addUserClient(query));
                        else {
                            system.sess._id = items[0]._id;
                            system.sess.name = items[0].name;
                            system.sess.email = items[0].email;
                            system.sess.many = items[0].many;
                            done(items[0]); 
                        }
                    });
                 });
            }
            db.close();
        });
    })
}
function getUserData(id) {
    return new Promise((done, fail)=>{
        mongoClient.connect(url, function(err, db){
            if (err) {
                fail(err);
            }
            else {
                let collection = db.collection("client");
                collection.find({
                    _id: new mongodb.ObjectID(id)
                }, function(err, cursor) {
                    cursor.toArray(function(err, items) {
                        if (err) fail(err);
                        else {
                            system.sess._id = items[0]._id;
                            system.sess.name = items[0].name;
                            system.sess.email = items[0].email;
                            system.sess.many = items[0].many;
                            done(items[0]);
                        }
                    });
                 });
            }
            db.close();
        });
    })
}
function getUserDataBasket(userId) {
    return new Promise((done, fail)=>{
        mongoClient.connect(url, function(err, db){
            if (err) {
                fail(err);
            }
            else {
                let collection = db.collection("Basket");
                collection.find({
                    "user": userId
                }, function(err, cursor) {
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
function addToBasketBD(itemMenu) {
    return new Promise((done, fail)=>{
        mongoClient.connect(url, function(err, db){
            if (err) {
                fail(err);
            }
            else {
                let collection = db.collection("Basket");
                let q = {"user":system.sess.id, "order":itemMenu, "status":1};
                collection.insertOne(q,
                    function(err, result) {
                        if (err) fail(err);
                        done(result.ops[0]);
                    });
            }
            db.close();
        });
    });
}

function addToBasket(id) {
    menu.getMenu(id)
        .then(itemMenu => {
            /* console.log("itemMenu:",itemMenu);
            console.log("system:",system); */
            if (itemMenu[0].price <= system.sess.many) {
                addMany(-itemMenu[0].price)
                    .then(data => {
                        io.emit('addMany', system.sess.many);
                    });
                addToBasketBD(itemMenu[0])
                    .then(data => {
                        io.emit('addToBasket', data);
                    });
        
                getUserDataBasket(system.sess.id) 
                .then(data => {
                   system.getAllDataMongo("orderStatus")
                        .then(status => {
                            let dataBasket = system.findOrderCtatus(data, status);
                            io.emit('getUserDataBasket', dataBasket);
                        })
                })
            
            }
            else {
                console.log("Денег не хватает, а пользователь пытается купить. Странно...")
            }
        });

}
module.exports={addUserClient, getUserClient, getUserData, getUserDataBasket, addToBasket, addToBasketBD};