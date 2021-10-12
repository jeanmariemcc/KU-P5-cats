const url = require("url");
const path = require("path");
const fs = require("fs");

const qs = require("querystring");
const formidable = require("formidable");

const breeds = require("../db/breeds");
const cats = require("../db/cats");

module.exports = (req, res) => {
	let pathName = url.parse(req.url).pathname;

	if (pathName === "/cats/add-cat" && req.method === "GET") {
		let pagePath = path.normalize(
			path.join(__dirname, "../views/addCat.html")
		);
		fs.readFile(pagePath, (err, html) => {
			if (err) {
				console.log(err);
				res.writeHeader(404, {
					"Content-Type": "text/plain",
				});
				res.write("404 Error HTML FILE NOT FOUND");
				res.end();
				return;
			}
			let catBreedPlaceholder = breeds.map(
				(breed) => `<option value="${breed}">${breed}</option>`
			);
			// cat breed placeholder is the list of all the breeds in <option> format for rendering to the html
			let modifiedData = html
				.toString()
				.replace("{{catBreeds}}", catBreedPlaceholder);
			// modified data is the html with all the breeds in the drop down
			res.writeHeader(200, { "Content-Type": "text/html" });
			res.write(modifiedData);
			res.end();
		});
	} else if (pathName === "/cats/add-cat" && req.method === "POST") {
		let form = new formidable.IncomingForm();
		// console.log("adding new cat");
		form.parse(req, (err, fields, files) => {
			// console.log(`add fields.name ${fields.name}`);
			if (err) {
				console.log(err);
				return;
			}
			let oldPath = files.upload.path;
			let newPath = path.normalize(
				path.join(__dirname, "../content/images/" + files.upload.name)
			);
			fs.rename(oldPath, newPath, (err) => {
				if (err) throw err;
				console.log(
					`image file ${files.upload.name} was uploaded successfully`
				);
			});

			fs.readFile("./db/cats.json", "utf8", (err, data) => {
				if (err) {
					throw err;
				}
				let allCats = JSON.parse(data);
				let catid =
					allCats.length == 0
						? 0
						: allCats[allCats.length - 1].id + 1;
				allCats.push({
					id: catid,
					...fields,
					image: files.upload.name,
				});
				let json = JSON.stringify(allCats);
				fs.writeFile("./db/cats.json", json, (err) => {
					if (err) throw err;
					console.log(
						`The cat ${fields.name} was successfully added`
					);
					res.writeHeader(302, { location: "/" });
					res.end();
				});
			});
		});
	} else if (pathName === "/cats/add-breed" && req.method == "GET") {
		let pagePath = path.normalize(
			path.join(__dirname, "../views/addBreed.html")
		);
		fs.readFile(pagePath, (err, html) => {
			if (err) {
				console.log(err);
				res.writeHeader(404, {
					"Content-Type": "text/plain",
				});
				res.write("404 Error HTML FILE NOT FOUND");
				res.end();
				return;
			}
			res.writeHeader(200, { "Content-Type": "text/html" });
			res.write(html);
			res.end();
		});
	} else if (pathName === "/cats/add-breed" && req.method == "POST") {
		let form = new formidable.IncomingForm();
		// console.log("taking in new breed data");
		form.parse(req, (err, fields, files) => {
			if (err) {
				console.log(err);
				return;
			}
			// console.log(fields.breed);
			let newBreed = fields.breed;
			fs.readFile("./db/breeds.json", (err, data) => {
				if (err) {
					throw err;
				}
				let breedsList = JSON.parse(data);
				breedsList.push(newBreed);
				// console.log(breedsList);
				let json = JSON.stringify(breedsList);
				fs.writeFile("./db/breeds.json", json, "utf-8", () =>
					console.log(`The breed ${newBreed} was succesfully added`)
				);
			});
		});
		res.writeHeader(302, { location: "/" });
		res.end();
	} else if (pathName.includes("/cats/edit-cat") && req.method == "GET") {
		let id = pathName.split("/")[3];
		let pagePath = path.normalize(
			path.join(__dirname, "../views/editCat.html")
		);
		fs.readFile(pagePath, (err, html) => {
			if (err) {
				console.log(err);
				res.writeHeader(404, {
					"Content-Type": "text/plain",
				});
				res.write("404 Error HTML FILE NOT FOUND");
				res.end();
				return;
			}
			let catBreedPlaceholder = breeds.map(
				(breed) => `<option value="${breed}">${breed}</option>`
			);
			// cat breed placeholder is the list of all the breeds in <option> format for rendering to the html
			let newHTML = html
				.toString()
				.replace("{{catBreeds}}", catBreedPlaceholder);
			// all the breeds in the drop down
			// replace the remainder of the data
			// let catsDB = JSON.parse(cats.json);
			let currCat = cats.find((cat) => {
				return cat.id == id;
			});

			// let option = template.toString();
			let keys = Object.keys(currCat);
			for (let key of keys) {
				while (newHTML.includes(`{{${key}}}`)) {
					newHTML = newHTML
						.toString()
						.replace(`{{${key}}}`, currCat[key] || "");
				}
			}
			res.writeHeader(200, { "Content-Type": "text/html" });
			res.write(newHTML);
			res.end();
		});
	} else if (pathName.includes("/cats/edit-cat") && req.method == "POST") {
		let id = pathName.split("/")[3];
		let form = new formidable.IncomingForm();
		form.parse(req, (err, fields, files) => {
			if (err) {
				console.log(err);
				return;
			}
			// let oldPath = files.upload.path;
			// let newPath = path.normalize(
			// 	path.join(__dirname, "../content/images/" + files.upload.name)
			// );
			// fs.rename(oldPath, newPath, (err) => {
			// 	if (err) throw err;
			// 	console.log(
			// 		`image file ${files.upload.name} was uploaded successfully`
			// 	);
			// });
			console.log(
				fields.name,
				fields.id,
				fields.description,
				fields.group,
				fields.image
			);
			fs.readFile("./db/cats.json", "utf8", (err, data) => {
				if (err) {
					throw err;
				}
				let allCats = JSON.parse(data);
				// console.log(`allCats before =  ${allCats}`);
				let currCatIndex = 0;
				for (let index in allCats) {
					if (allCats[index].id == id) {
						currCatIndex = index;
					}
				}
				allCats[currCatIndex] = {
					...allCats[currCatIndex],
					...fields,
				};
				console.log(`currCatIndex ${currCatIndex}`);
				// currCat = allCats[currCatIndex];
				console.log(
					`allCats[currCatIndex].name = ${allCats[currCatIndex].name}`
				);
				// allCats[currCatIndex].name = fields.name;
				// let keys = Object.keys(currCat);
				// for (let key of keys) {
				// 	currCat[key] = fields[key] || currCat[key];
				// }
				console.log(
					`allCats[currCatIndex].name after replacement ${allCats[currCatIndex].name}`
				);
				// allCats[currCatIndex] = currCat;
				console.log(`allCats after =  ${allCats}`);

				let json = JSON.stringify(allCats);
				fs.writeFile("./db/cats.json", json, (err) => {
					if (err) throw err;
					console.log(
						`The cat ${fields.name} was successfully edited`
					);
					res.writeHeader(302, { location: "/" });
					res.end();
				});
			});
		});
		// console.log(`edit cat post`);
	} else if (pathName.includes("/cats/delete-cat") && req.method == "GET") {
		console.log(`delete cat get`);
	} else if (pathName.includes("/cats/delete-cat") && req.method == "Post") {
		console.log(`delete cat post`);
	} else {
		return false;
	}
};
