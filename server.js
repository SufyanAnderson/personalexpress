const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://sufyanA:0RFEKsz1PdMmQysT@cluster0.w8phv3p.mongodb.net/savage-auth?retryWrites=true&w=majority";
const dbName = "savage-auth";

//a2CRbNwmmYtEfs0g

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/messages', (req, res) => {
  console.log('this is req.body',req.body)
  db.collection('messages').insertOne({favorited: false, verse: req.body.verse, name: req.body.name, quote: req.body.quote, thumbUp: 0, thumbDown:0}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/messages', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({verse: req.body.verse, name: req.body.name, quote: req.body.quote}, {
    $set: {
      name: req.body.name
    
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.put('/favorite', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, quote: req.body.quote}, {
    $set: {
      favorited: req.body.favorited,
    
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})
app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({name: req.body.name, quote: req.body.quote}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
