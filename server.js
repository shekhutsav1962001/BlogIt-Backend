require('dotenv').config()
const express = require('express')
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const multer = require('multer')
const path = require("path");
const PORT = process.env.PORT || 5000;

const app = express()

// get all routes
const authRoutes = require('./routes/authRoute')
const blogRoutes = require('./routes/blogRoute')

// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//cors & helmet
app.use(cors());
app.use(helmet());

//image google cloud cloud
const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
})
app.use(multerMid.single('file'))

// connect database
require('./database/database')();

// morgan
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// for testing purpose
app.get('/', (_, res) => {
    res.send("Hello Utsav from Blog Server")
})

// user all routes
app.use('/auth', authRoutes)
app.use('/blog', blogRoutes)

// hosting
// if (process.env.NODE_ENV === "production") {
//     // set a static folder
//     app.use(express.static("frontend/blogit/build"));

//     // Provide a wildcard as a fallback for all routes
//     app.get("*", (req, res) => {
//         res.sendFile(
//             path.resolve(__dirname, "../frontend/blogit", "build", "index.html")
//         );
//     });
// }
// listen server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
