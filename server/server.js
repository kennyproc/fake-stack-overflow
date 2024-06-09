// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT']
}));
app.use(express.urlencoded({extended:true}));
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const ObjectId = require('mongodb').ObjectId;

const Question = require('./models/questions');
const Answer = require('./models/answers');
const Tag = require('./models/tags');
const User = require('./models/users');
const Comment = require('./models/comments');

mongoose.connect('mongodb://localhost:27017/fake_so', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Mongo connection open")
    })
    .catch(err => {
        console.log("ERROR")
        console.log(err);
    })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'notagoodsecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000*24,
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    },
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/fake_so'})
}));

app.listen(8000, () => {
    console.log('Listening on port 8000...');
})

app.get("/", async (req, res) => {
    const questions = await Question.find({});
    const answers = await Answer.find({});
    const tags = await Tag.find({});
    const comments = await Comment.find({});
    const model = {
        data: {questions, answers, tags, comments}
    }
    const user = await User.find({"_id" : new ObjectId(req.session.user_id)});
    const stuff = {model, user}
    res.send(stuff);
});

app.post('/register', async (req, res) => {
    const {firstname, lastname, username, email, password} = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        firstname,
        lastname,
        username,
        email,
        passwordHash: hash
    })
    let existingUser = await User.findOne({username})
    if (existingUser) {
        res.send(null);
    } else {
        existingUser = await User.findOne({email});
        if (existingUser) {
            res.send(null);
        } else {
            await user.save();
            req.session.user_id = user._id;
            res.send(user);
        }
    }
})

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (user) {
        const validPw = await bcrypt.compare(password, user.passwordHash);
        if (validPw) {
            req.session.user_id = user._id;
            res.send(user);
        } else {
            console.log("try again");
            res.send(null);
        }
    } else {
        console.log("try again");
        res.send(null);
    }
})

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.send(req.session.user_id);
})

app.put('/question/:id', async (req, res) => {
    const { id } = req.params;
    await Question.findByIdAndUpdate(id, req.body, {runValidators: true});
})

app.post("/question", async (req, res) => {
    const newQuestion = new Question(req.body);
    await newQuestion.save();
})

app.post("/tag", async (req, res) => {
    const newTag = new Tag(req.body);
    await newTag.save();
})

app.post("/answer", async (req, res) => {
    const newAnswer = new Answer(req.body);
    await newAnswer.save();
})

app.put('/answer/:id', async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    await Answer.findByIdAndUpdate(id, req.body, {runValidators: true});
})

app.post("/comment", async (req, res) => {
    const newComment = new Comment(req.body);
    await newComment.save();
    res.send(newComment);
})
