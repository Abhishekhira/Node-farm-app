console.log('hello');
const fs=require("fs");
const url=require("url");
// const url=require("url");
// console.log(url.parse())

console.log(`${__dirname}/file.txt`)


const product=  fs.readFileSync(`${__dirname}/data.json`,"utf8",(err,data)=>{
    console.log("hii")
})
const dataObj=JSON.parse(product)
function replaceFun(temp,item) {
    let output =temp.replace(/{%PRODUCTNAME%}/g,item.productName);
    output =output.replace(/{%IMAGE%}/g,item.image);
    output =output.replace(/{%PRICE%}/g,item.price);
    output =output.replace(/{%QUANTITY%}/g,item.quantity);
    output =output.replace(/{%ID%}/g,item.id);
    output =output.replace(/{%DESCRIPTION%}/g,item.description);
    output =output.replace(/{%FROM%}/g,item.from);

    if (!item.organic) {
        output =output.replace(/{%NOT_ORGANIC%}/g,"not-organic");  
    }
   return output;
}

const http=require("http")
const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
  );
  const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8'
  );
  const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8'
  );

const server=http.createServer((req,resp)=>{
 const{query,pathname}= url.parse(req.url,true)
   console.log(query.id)
   if(pathname=='/overview' || pathname=="/"){
    resp.writeHead('200',{"Content-Type":"text/html"})
    const cardHTML=dataObj.map((item)=>replaceFun(tempCard,item)).join("");
    const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardHTML)
    resp.end(output)
   }else if(pathname=="/api"){
    resp.writeHead(200,{"Content-Type":"application/json"})
    resp.end(product)
   }
   
   else if(pathname=='/product'){
    // resp.end("welcome to product page")
    resp.writeHead(200,{"Content-Type":"text/html"})
   const product =dataObj[query.id];
   const output=replaceFun(tempProduct,product)
   resp.end(output)
   } else if(pathname=='/about'){
    resp.end('hii about page')
   }else{
    resp.writeHead(404)
    resp.end("page not found")
   }

})

server.listen(4500,()=>{
    console.log("server is  created")
})