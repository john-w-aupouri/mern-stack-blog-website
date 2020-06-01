import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import path from 'path';

// server
const app = express();

// for heroku deployment in case port is occupied
const PORT = process.env.PORT || 8000;

// middleware
app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.json());

// function to adhere to the DRY principal
const withDB = async (operations, res) => {
  try {
    const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true});
    const db = client.db('mern-stack-development');

    await operations(db);

    client.close();

  } catch (error) {
    res.status(500).json({ message: 'Error connecting to db', error });
  }
}

// get blog by name url parameter
app.get('/api/blogs/:name', async (req, res) => {
  withDB(async (db) => {
    const blogName = req.params.name;

    const blogInfo = await db.collection('blogs').findOne({ name: blogName });
    res.status(200).json(blogInfo);
  }, res);
})

// likes route
app.post('/api/blogs/:name/likes', async (req, res) => {
  withDB(async (db) => {
    const blogName = req.params.name;

    const blogInfo = await db.collection('blogs').findOne({ name: blogName });

    // Querry to increment likes
    await db.collection('blogs').updateOne({ name: blogName }, {
      // mongodb syntax
      '$set': {
        likes: blogInfo.likes + 1,
      }
    });

    // get updated blogInfo
    const updatedBlogInfo = await db.collection('blogs').findOne({ name: blogName });

    // send updatedBlogInfo back to the client
    res.status(200).json(updatedBlogInfo);
  }, res);
});

// dislikes route
app.post('/api/blogs/:name/dislikes', async (req, res) => {
  withDB(async (db) => {
    const blogName = req.params.name;

    const blogInfo = await db.collection('blogs').findOne({ name: blogName });
    await db.collection('blogs').updateOne({ name: blogName }, {
      '$set': {
        dislikes: blogInfo.dislikes + 1,
      }
    });

    // get updated blogInfo
    const updatedBlogInfo = await db.collection('blogs').findOne({ name: blogName });

    // send updatedBlogInfo back to the client
    res.status(200).json(updatedBlogInfo);
  }, res);
  
});

// comments route
// app.post('/api/blogs/:name/add-comment', (req, res) => {
//   const { username, text } = req.body;
//   const blogName = req.params.name;

//   withDB(async (db) => {
//     const blogInfo = await db.collection('blogs').findOne({ name: blogName });
//       await db.collection('blogs').updateOne({ name: blogName }, {
//         '$set': {
//           comments: blogInfo.comments.concat({ username, text }),
//         }
//     });

//     const updatedBlogInfo = await db.collection('blogs').findOne({ name: blogName });


//     res.status(200).json(updatedBlogInfo);
//   }, res);
// });

app.get('*', (req, res) => {
  // all requests not caught by any other route should be passed onto App
  res.sendFile(path.join(__dirname + '/build/index.html'));
})

app.listen(PORT, () => console.log('Listening on port 8000'));