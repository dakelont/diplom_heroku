/* const mongodb = require("mongodb");

const mongoClient = mongodb.MongoClient;
 */
const system = require("./system.js");
mongoClient = system.mongoClient;
mongodb = system.mongodb;

module.exports= (sumForAdd) => {
    return new Promise((done, fail)=>{
        mongoClient.connect(system.url, function(err, db){
            if (err) {
                fail(err);
            }
            else {
                let collection = db.collection("client");
                collection.update({
                    _id: new mongodb.ObjectID(system.sess.id)
                },
                {$inc: {many:sumForAdd}}, 
                function(err, res) {
                    system.sess.many += sumForAdd;
                    /* console.log(sess.many); */
                    done(system.sess.many);
                });
        }
            db.close();
        });
    });
}