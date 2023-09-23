//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Item = mongoose.model('Item', {
  name: String
});



async function run() {
  try {
    // Create an array of documents to insert
    docs = [
      {
        name: "welcome to your todolist",
      },
      {
        name: "hit the + button to add your item",
      },
      {
        name: "hit to delete an item",
      }
    ];

    items = await Item.find();

    // Close the MongoDB connection
    
    if (items.length === 0) {
      const result = await Item.insertMany(docs);
      console.log(`${result.length} documents were inserted`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

run().catch(console.dir);

app.get("/",async function(req, res) {

  const items = await Item.find();
  res.render("list", {listTitle: "Today", newListItems: items});

    
});

app.post("/", async function (req, res) {
  const itemname = req.body.newItem;

  try {
    // Create an array of documents to insert
    const docs = [
      {
        name: itemname,
      }
    ];

    const result = await Item.insertMany(docs);
    console.log(`${result.length} documents were inserted`);
  } catch (error) {
    console.error("Error:", error);
  }
  res.redirect("/");
  // Redirect or respond as needed here
});

app.post("/delete", async function(req,res){
  const checkeditemID = req.body.checkbox;
  try {
    await Item.findByIdAndDelete(checkeditemID);
    console.log("Successfully deleted");
  } catch (err) {
    console.error("Error:", err);
  }
  res.redirect("/");
});


app.get("/about", function(req, res){
  res.render("about");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("Server started on port 3000");
});
