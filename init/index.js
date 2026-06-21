const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_Url = "mongodb://127.0.0.1:27017/wanderlust"
main().then(res =>{
    console.log("connection succesful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_Url);
}

const initdb = async ()=> {
 await Listing.deleteMany({});
initData.data = initData.data.map((obj)=>({...obj,owner:"6a2f8e6f2317953e3ba496f8"}))
 await Listing.insertMany(initData.data);
 console.log("data was saved");
}

initdb();