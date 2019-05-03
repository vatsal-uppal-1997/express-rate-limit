const fs = require("fs");
const https = require("https");
const path = require('path')
const express = require("express");
const bodyParser = require("body-parser");
const serveStatic = require('serve-static-throttle');
const session = require("express-session");
const app = express();


app.use(session({secret: "lolno"}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
//app.use("/static", express.static("static"));
//app.get("/", (req, res) => {
//	res.send("test");
//});

let FACTOR = 10;

app.get("/", function(req, res) {
	res.render("pages/index");
});
app.post("/", function(req, res) {
	req.session.FACTOR = req.body.factor;
	console.log(req.session);
	res.redirect("/");
});

//app.use("/static", (req,res) => serveStatic('static', {
//'index': false,
//"throttle" : {
//	"bps" : (1023 * 1024 * req.session.FACTOR)/8
//}
//}))

app.use("/static", (req, res, next) => {
	const serve = serveStatic("static", {
		"index": false,
		"throttle" : {
			"bps" : (1024 * 1024 * req.session.FACTOR)/8
		}
	});
	serve(req, res, next);
})

https.createServer({
	key: fs.readFileSync("server.key"),
	cert: fs.readFileSync("server.cert")
}, app).listen(3001, () => {
	console.log("Server up....");
});
