const system = require("./drone-cafe/system/system.js");
app = system.app;
http = system.http;
io = system.io;
bodyParser= system.bodyParser;
url = system.url;
mongoClient = system.mongoClient;

const addMany = require("./drone-cafe/system/add-many.js");
const client = require("./drone-cafe/system/client.js");
const kitchen = require("./drone-cafe/system/kitchen.js");
const menu = require("./drone-cafe/system/menu.js");
const drone = require('netology-fake-drone-api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});
app.get('/kitchen', function(req, res){
	res.sendFile(__dirname + '/kitchen/index.html');
});

app.get("/bower_components/*.css", function (req, res){
    res.sendFile(__dirname + req.originalUrl);
});
app.get("/bower_components/*.js", function (req, res){
    res.sendFile(__dirname + req.originalUrl);
});
app.get("/bower_components/*.js.map", function (req, res){
    res.sendFile(__dirname + req.originalUrl);
});
app.get("/service/*.js", function (req, res){
    res.sendFile(__dirname + req.originalUrl);
});
app.get("/client/*.js", function (req, res){
    res.sendFile(__dirname + req.originalUrl);
});
app.get("/client/*.html", function (req, res){
    res.sendFile(__dirname + req.originalUrl);
});
app.get("/kitchen/*.js", function (req, res){
    res.sendFile(__dirname + req.originalUrl);
});
app.get("/kitchen/*.html", function (req, res){
    res.sendFile(__dirname + req.originalUrl);
});

app.post("/users", function(req, res) {
    let query = {data: req.body};

    client.getUserClient(query)
        .then(data => { 
            if (data._id) res.send(data._id);
            else res.send({error:"Ошибка авторизации"});
        });
});
app.get("/users/:id", function(req, res) {
    system.sess.id = req.params.id;
    client.getUserData(system.sess.id)
        .then(data => { 
            if (data._id) res.send(data);
            else res.send({error:"Ошибка авторизации"});
        });
        client.getUserDataBasket(system.sess.id) 
        .then(data => {
            system.getAllDataMongo("orderStatus")
                .then(status => {
                    let dataBasket = system.findOrderCtatus(data, status);
                    io.emit('getUserDataBasket', dataBasket);
                })
        })
});

io.on('connection', function(socket){
	
	socket.on('addMany', function(){
        addMany(100)
            .then(data => {
                io.emit('addMany', system.sess.many);
            });
    });
    
    socket.on('addToOrder', function(){
        menu.getMenuAll()
            .then(data => {
                io.emit('addToOrder', data);
            })
    })

	socket.on('addToBasket', function(id){
        client.addToBasket(id);
    });
	socket.on('getUserDataBasket', function(){
        client.getUserDataBasket(system.sess.id) 
        .then(data => {
           system.getAllDataMongo("orderStatus")
                .then(status => {
                    let dataBasket = system.findOrderCtatus(data, status);
                    io.emit('getUserDataBasket', dataBasket);
                })
        })

    });
    
	socket.on('startCooking', function(id){
        system.changeOrderCtatus(id, 2)
            .then(data => {
                if (data == 1) {
                   kitchen.allOrder()
                        .then(data => {
                            system.getAllDataMongo("orderStatus")
                                .then(status => {
                                    let dataBasket = system.findOrderCtatus(data, status);
                                    io.emit('allOrder', dataBasket);
                                    
                            })
                        })
                }
            })
	});
	socket.on('stopCooking', function(id){
        system.changeOrderCtatus(id, 3)
            .then(data => {
                if (data == 1) {
                    kitchen.allOrder()
                        .then(data => {
                            system.getAllDataMongo("orderStatus")
                                .then(status => {
                                    let dataBasket = system.findOrderCtatus(data, status);
                                    io.emit('allOrder', dataBasket);
                                })
                        })
                    drone
                        .deliver()
                        .then(() => {
                            setTimeout(()=>{
                                system.changeOrderCtatus(id, 5);
                            }, 2000);
                            setTimeout(()=>{
                                system.clearBasket(id);
                            }, 2*60*1000);
                        })
                        .catch(() => {
                            setTimeout(()=>{
                                system.changeOrderCtatus(id, 4);
                            }, 2000);
                            setTimeout(()=>{
                                system.clearBasket(id);
                            }, 2*60*1000);

                        });
                }
            })
            .catch();
	});

    socket.on('allOrder', function(){
        kitchen.allOrder()
            .then(data => {
               system.getAllDataMongo("orderStatus")
                    .then(status => {
                        let dataBasket = system.findOrderCtatus(data, status);
                        io.emit('allOrder', dataBasket);
                        
                })
            })

    });

	//socket.on('disconnect', function(){	});
});

let port = process.env.PORT || 3000;

http.listen(port, function(){
    console.log('Start server http://localhost:' + port + '/');
});