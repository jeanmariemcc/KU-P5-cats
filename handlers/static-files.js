const url = require("url");
const path = require("path");
const fs = require("fs");

function getContentType(url) {
	if (url.endsWith("css")) {
		return "text/css";
	} else if (url.endsWith("html")) {
		return "text/html";
	} else if (url.endsWith("js")) {
		return "text/javascript";
	} else if (url.endsWith("png")) {
		return "image/png";
	} else if (url.endsWith("ico")) {
		return "image/ico";
	} else if (url.endsWith("jpg") || url.endsWith("jpeg")) {
		return "image/jpeg";
	}
}

module.exports = (req, res) => {
	let pathName = url.parse(req.url).pathname;
	if (pathName.includes("/content") && req.method == "GET") {
		// console.log(`static-files line 22 ${pathName}`);

		let filePath = path.normalize(path.join(__dirname, ".." + pathName));

		// console.log(`static files line 26 filePath: ${filePath}`);
		fs.readFile(filePath, (err, staticContent) => {
			if (err) {
				console.log(err);
				res.writeHeader(404, {
					"Content-Type": "text/plain",
				}); // do I need the semi colon?
				res.write(
					`404 Error ${getContentType(pathName)}  FILE NOT FOUND`
				);
				res.end();
				return;
			}
			res.writeHeader(200, { "Content-Type": getContentType(filePath) });
			res.write(staticContent);
			res.end();
		});
	} else {
		return false;
	}
};
