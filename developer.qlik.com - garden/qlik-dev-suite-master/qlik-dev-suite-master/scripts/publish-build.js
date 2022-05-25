const fs = require("fs-extra")
const path = require("path")

const distLocation = path.resolve(__dirname, "../dist/dev-suite.zip")
const packageLocation = path.resolve(__dirname, "../package.json")

fs.readJSON(packageLocation)
	.then(package => package.version)
	.then(version => fs.copyFile(distLocation, path.resolve(__dirname, `../dev-suite_${version}.zip`)))
