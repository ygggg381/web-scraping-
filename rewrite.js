

let FillValue = async (page , value) => {
    const inputBox = await page.waitForSelector("textarea", { timeout: 20000 });
    await inputBox.fill(value);
}
let Click = async (page) => {
      const rewriteButton = await page.waitForSelector("button:has-text('Generate')", { timeout: 20000 });
      await rewriteButton.click();
}

let AddNewText = async (page,components,key) => {

      await page.waitForFunction(() => {
        const el = document.querySelector("div[id*='suggestions']");
        return el && el.textContent.trim().length > 0;
      }, { timeout: 10000 });

      const newText = await page.textContent("div[id*='suggestions']");
      components[key] = newText.trim();
}

let EmptyTextArea = async (page) => {
    const inputBox = await page.waitForSelector("textarea", { timeout: 20000 });
    await inputBox.fill("");
    await page.waitForTimeout(2000);
}


async function safeRun(fn, errMsg) {
  try {
    return await fn();
  } catch {
    console.log(errMsg);
    return;
  }
}


async function rewriteComponents(page,components) {

// go to rewriter  
try{  
  await page.goto("https://ralfvanveen.com/en/tools/ai-rewriter-to-human/", { waitUntil: "domcontentloaded" });
}
catch{
  console.log('rewrite URL is not reachable');
  return;
}

for (const key of Object.keys(components)) {
  const value = components[key];

  //Fill Input by value
    try{  
    await  FillValue(page, value);
  }
  catch{
    console.log("inputBox not found");
    return;
}

  //Click rewrite
    try{  
    await  Click(page);
  }
  catch{
    console.log("rewriteButton not found");
    return;
}

  //UPDATE components
    try{  
    await  AddNewText(page, components, key);
  }
  catch{
    console.log("newText not found");
    return;
}


  //EmptyTextArea
    try{  
    await  EmptyTextArea(page);
  }
  catch{
    console.log("can not empty textarea");
    return;
}

}


  return components;
}

export default rewriteComponents;
