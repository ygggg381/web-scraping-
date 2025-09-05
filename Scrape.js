
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


async function safeRun(fn, errMsg) {
  try {
    return await fn();
  } catch {
    console.log(errMsg);
    return;
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

  await safeRun(() => AddTitle(page, components), "title not found");
  let elements = await safeRun(() => getElements(page), "elements not found");
  await safeRun(() => AddElements(elements, components), "elements can't able to add to components");
  
  return components;
}

export default scrapeArticle;
