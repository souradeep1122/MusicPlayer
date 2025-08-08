const path = require('path');
const express = require('express');
const { url } = require('inspector');
const app = express();
const fs = require('fs');

const multer = require('multer');

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        return cb(null,"./uploads")

    },
    filename: function (req,file,cb){
        return cb(null ,`${Date.now()}-${file.originalname}`);
    }
})

// Set custom views directory
app.set('views', path.join(__dirname, '/views'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:false}));

app.get('/', (req, res) => {
    res.render('index'); // Express will look for 'your_views_folder/index.ejs'
});
const upload = multer({storage});

app.post('/upload', upload.single("profile_img"),(req,res) =>{
    console.log(req.body)
    console.log(req.file)

    return res.redirect("/files")

})


// Show uploaded files
app.get('/files', (req, res) => {
  const uploadsDir = path.join(__dirname, 'uploads');
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Error reading uploads directory:', err);
      return res.status(500).send('Unable to read uploads directory');
    }
    const visibleFiles = (files || []).filter(f => !f.startsWith('.'));
    res.render('files', { files: visibleFiles });
  });
});


app.listen(3000, () => console.log('Server running on port 3000'));
