const fs = require("fs");
const http = require("http");
const url = require("url");
const path = require("path");

const slugify = require("slugify");

const replacetemplate = require("./modules/replacetemplates");

// ////////////////////////////////////////
// FILES

// to read file synchronusly
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// To write file synchronusly
// const textOut = `hello ${textIn} \n Created on ${new Date()}`;
// fs.writeFileSync("./txt/output.txt", textOut);

// To read file asynchronus
// fs.readFile("./txt/input.txt", "utf-8", (err, data) => {
//   console.log(data);
// });

// // To write file asynchronus
// fs.writeFile("./txt/output.txt", "hello world", (err) => {
//   console.log("Your file has written successfully");
// });

////////////////////////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataobj = JSON.parse(data);

const slugs = dataobj.map((el) => slugify(el.productName, { lower: true }));
// console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });
    const cardhtml = dataobj
      .map((el) => replacetemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardhtml);
    res.end(output);

    // Product Page
  } else if (pathname === "/product") {
    const product = dataobj[query.id];
    const output = replacetemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);

    // Not found page
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>page not found</h1>");
  }
});

server.listen(5000, "127.0.0.1", () => {
  console.log("server listening on");
});
