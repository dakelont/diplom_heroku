const system = require("./system.js");
mongoClient = system.mongoClient;
mongodb = system.mongodb;

function allOrder() {
    return new Promise((done, fail)=>{
        mongoClient.connect(system.url, function(err, db){
            if (err) {
                fail(err);
            }
            else {
                let collection = db.collection('Basket');
                collection.find({'status': {$in: [1,2]}}, function(err, cursor) { 
                    cursor.toArray(function(err, items) {
                        if (err) fail(err);
                        else {
                            /* console.log("allOrder:",items); */
                            done(items);
                        }
                    });
                 });
            }
            db.close();
        });
    });
}

module.exports={allOrder};