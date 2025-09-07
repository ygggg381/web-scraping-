import { chromium } from "playwright";
import scrapeArticle from "./Scrape.js";
import rewriteComponents from"./rewrite.js";
import buildArticle from "./atricle_collection.js";
import publishToBlogger  from"./postOnBlogger.js";
import image from "./image.js"
import {authorize} from "./authorization.js";
import fs from "fs";
import isOnline from "is-online";


let OpenBrowser = async () =>{
  try{
      const browser = await chromium.launch({ headless: true }); 
      const context = await browser.newContext(); 
      const page =  await context.newPage(); 
      return page;
  }
  catch{
    console.log("browser can't able to open ")
    return;
  }

} 

let Article = async (page, url,label) => {


  // scrape article
  let components = await scrapeArticle(page,url);

  if(!components){
    return;
  }
 
  //  rewrite article
  let modified_components = await rewriteComponents(page,components);
  
  if(!modified_components){
    return;
  }

  //article collection
  let article =   buildArticle(modified_components);

  if(!article){
    return;
  }

   const img = await image(page,modified_components.h1,authorize)
   if(!img){
    return;
   }


  await publishToBlogger(modified_components.h1, article,img,authorize,label);

};



 function WRITELastArticles(key, value) {
  let data = {};

  if (fs.existsSync('articles.json')) {
    const fileContent = fs.readFileSync('articles.json', "utf-8");
    try {
      data = JSON.parse(fileContent);
    } catch {
      data = {};
    }
  }

  data[key] = value;

  // احفظ الملف من جديد
  fs.writeFileSync('articles.json', JSON.stringify(data, null, 2), "utf-8");
}


 function getlastArticles() {
  if (!fs.existsSync('articles.json')) {
    console.log("File not found:", 'articles.json');
    return [];
  }

  const fileContent = fs.readFileSync('articles.json', "utf-8");

  try {
    const data = JSON.parse(fileContent);
    return Object.values(data);
  } catch (err) {
    console.log("Invalid JSON:", err);
    return [];
  }
}

async function App(){
  // step 1 open browser 
  let page = await OpenBrowser()

  if(!page){
  console.log('articleURL not found')
  return;
}

  const sections = {
  'اخبار حصرية':'https://www.youm7.com/Section/%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1-%D8%B9%D8%A7%D8%AC%D9%84%D8%A9/65/1',
  'حوادث' : 'https://www.youm7.com/Section/%D8%AD%D9%88%D8%A7%D8%AF%D8%AB/203/1',
  'رياضة': 'https://www.youm7.com/Section/%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1-%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%B6%D8%A9/298/1',
  'رياضة عالمية' : 'https://www.youm7.com/Section/%D9%83%D8%B1%D8%A9-%D8%B9%D8%A7%D9%84%D9%85%D9%8A%D8%A9/332/1',
}


while(true){
if(await isOnline()){
  for (const [key, value] of Object.entries(sections)){

    const PostedArticles =  getlastArticles()
      // step 2 open section
    try{
      await page.goto(value,{ waitUntil: "domcontentloaded" })
    }catch{
      console.log(' section URL is not reachable')
    }

    try{
      await page.waitForSelector('#paging >div>a',{ timeout: 20000 })
      var A_tag = await page.getAttribute('#paging >div>a','href')
    }catch{
      console.log('A_tag not found')
      continue;
    }
    const articleURL = `https://www.youm7.com${A_tag}`
    if(PostedArticles.includes(articleURL)){
      continue;
    }
    WRITELastArticles(key,articleURL)
    await Article(page,articleURL,key)

  }
  console.log('Loop finshed ')
  await page.waitForTimeout(100000);
  }
  else{
    console.log('Internet conncection error')
  }

  }}
App()
