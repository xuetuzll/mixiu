const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//引入passport是为了验证token信息
const passport = require("passport");
const app = express();

//引入users.js
const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles")

//DB config
const db = require("./config/keys").mongoURI;

//使用body-parser中间件
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

//Connect to mongodb
mongoose.connect(db)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))

//passport 初始化后才能正常使用
app.use(passport.initialize());

//引入passport同时给它传递过去一个passport，上面引入的passport
//想在一个指定的文件内写passport文件，就需要把地址引入，把passport传过去
require("./config/passport")(passport);

// app.get("/", (req, res) => {
//     res.send('Hello World!');
// })

//使用routes，请求路径前面有前缀的原因。
app.use("/api/users", users);
app.use("/api/profiles", profiles);

const port = process.env.PORT || 5000;

//前后端连载：concurrently插件的使用
app.listen(port, () => {
    console.log(`SErver Running on port ${port}`)
})
