
let AddTitle = async (page,components) =>{
    await page.waitForSelector("h1", { timeout: 20000 });
    components["h1"] = (await page.textContent("h1")).trim();
}

let getElements = async (page) =>{
      await page.waitForSelector("div#articleBody", { timeout: 20000 });
      return await page.$$(
        "div#articleBody p, div#articleBody h2, div#articleBody h3, div#articleBody h4, div#articleBody h5, div#articleBody h6"
      );
}

let AddElements = async (elements,components) => {
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const tagName = await el.evaluate(node => node.tagName.toLowerCase());
        const text = (await el.textContent()).trim();

        if (text) {
          const key = `${tagName}_${i + 1}`;
          components[key] = text;
        }
      }
}


async function scrapeArticle(page,url) {
  const components = {};
  
  // goto link
  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });
  }   catch {
    console.log("article URL is not reachable");
    return;
  }

    // ADD title 
  try {
    await AddTitle(page, components)
  }   catch {
    console.log("Title of article not found");
    return;
  }
   
  // GET elements
    try {
    var elements =  await getElements(page)
  }   catch {
    console.log("elements not found");
    return;
  }


    // ADD elements
    try {
    await AddElements(elements, components)
  }   catch {
    console.log("elements can't able to add to components");
    return;
  }
   
  
  return components;
}

export default scrapeArticle;
