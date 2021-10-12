const url = require("url");
const fs = require("fs");
const path = require("path");
const cats = require("../db/cats.json"); // const because we will not be changing it here
// const { homedir } = require("os");

//these above, are not accessable to the indexedDB.js page

module.exports = (req, res) => {
	let pathName = url.parse(req.url).pathname;
	// console.log(`pathName = ${pathName}`);

	if (pathName === "/" && req.method === "GET") {
		// show the home page
		// first, get the path to the home page
		// __dirname is a global built-in  variable, see the two underscores
		//.join concatenates

		let pagePath = path.normalize(
			path.join(__dirname, "../views/home/index.html")
		);
		// console.log(`pagePath ${pagePath}`);
		fs.readFile(pagePath, (err, html) => {
			if (err) {
				console.log(err);
				res.writeHeader(404, {
					"Content-Type": "text/plain",
				}); // do I need the semi colon?
				res.write("404 Error HTML FILE NOT FOUND");
				res.end();
				return;
			}
			// let catTemplate = path.normalize(
			// 	path.join(__dirname, "../views/templates/catTemplate.html")
			// );
			fs.readFile(
				path.join(__dirname, "../views/templates/catTemplate.html"),
				(err, template) => {
					let output = cats.map((cat) => {
						// console.log(`cats ${cats}`);
						// console.log(`cat ${cat}`);

						let option = template.toString();

						let keys = Object.keys(cat);
						// console.log(`keys ${keys}`);

						for (let key of keys) {
							while (option.includes(`{{${key}}}`)) {
								option = option.replace(
									`{{${key}}}`,
									cat[key] || ""
								);
							}
						}

						return option;
					});
					html = html.toString().replace("{{cats}}", output);

					res.writeHeader(200, { "Content-Type": "text/html" });
					res.write(html);
					res.end();
				}
			);
		});
		// they use async file read, Patrick did not. cannot detect errors, but this is a school project so...
	} else {
		return false; // note: homework had reverse logic - is request not handled? true, is really request failed. But we turned it back to regular logic and are returning false
	}
};

// fs.readFile(pagePath, (err, html) => {
// 	if (err) {
// 		console.log(err);
// 		res.writeHeader(404, {
// 			"Content-Type": "text/plain",
// 		}); // do I need the semi colon?
// 		res.write("404 Error HTML FILE NOT FOUND");
// 		res.end();
// 		return;
// 	}
// 	res.writeHeader(200, { "Content-Type": "text/html" });
// 	res.write(html);
// 	res.end();
// });
