const http = require("http");
const path = require("path");
const port = 3000; // should be 3000 - 9999
// common ports are 3000 3333 50000 8000 8080 9000
const handlers = require("./handlers/index.js");
let homeRoute = require("./handlers/home.js");

http.createServer((req, res) => {
	// homeRoute(req, res); // replaced with loop below
	for (let handler of handlers) {
		if (handler(req, res)) {
			// if handler worked , great, otherwise go to next handler (route)
			break;
		}
	}
	// res.writeHead(200, {
	// 	"Content-Type": "text/plain",
	// });
	// // res.write("Hello from JM index.js!! Right Now");

	// res.write(path.join(__dirname, "./views/home/index.html"));
	// res.end();
}).listen(port);

/*
Routes
home (/)
Add breed ('/addBreed') and post
Add Cat ('/addCat') and post
edit cat ('/editCat:id') and post(PUT,Patch)  usually a PUT - 90% sometimes a PATCH
   id part of route or part of query paramenter
Front end (views) always GETs || backend HTTP erver - GETS or POSTs 
   ( user has data to add - POST, or GET info for front end)

   summary:
   front end (views) Gets -> middle ware: HTTP server (GET|POST)  ->  DataBase (CRUD)
*/
