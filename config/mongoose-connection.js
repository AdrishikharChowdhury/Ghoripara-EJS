const mongoose = require("mongoose");
const dbgr=require('debug')("development:mongoose")
const config =require("config")

mongoose
  .connect(`${config.get("MONGODB_URI")}/ghoripara`)
  .then(() => {
    dbgr("Connected");
  })
  .catch(() => {
    dbgr("Not connected");
  });


module.exports = mongoose.connection;
