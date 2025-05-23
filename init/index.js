const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js"); // "../" two dots means require a file out side of the cureent folder


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
.then(()=>{
    console.log("Connect to the DB");
})
.catch((err) =>{
    console.log(err);
    console.log("Some error in connection");
});


const initDB = async () =>{
    await Listing.deleteMany({});
   initData.data = initData.data.map((obj) =>({...obj,owner: "67eee62765d423be53ab76f7"}));
    await Listing.insertMany(initData.data); // initData = is object and data is key of data. 

    console.log("data was initialized");


}

initDB();

