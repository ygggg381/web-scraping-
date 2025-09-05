function buildArticle(components) {
  if(!components){
    return;
  }

  let article = "";

  for (const key of Object.keys(components)) {
    try{
    const value = components[key];
    if (key.startsWith("p_")) {
      article += `<p style="font-size: medium; text-align: right;">${value}</p>`;
    } else if (key.startsWith("h2")) {
      article += `<h2 style="font-size: x-large; text-align: right;">${value}</h2>`;
    } else if (key.startsWith("h3")) {
      article += `<h3 style="font-size: x-large; text-align: right;">${value}</h3>`;
    } else if (key.startsWith("h4")) {
      article += `<h4 style="font-size: x-large; text-align: right;">${value}</h4>`;
    } else if (key.startsWith("h5")) {
      article += `<h5 style="font-size: x-large; text-align: right;">${value}</h5>`;
    } else if (key.startsWith("h6")) {
      article += `<h6 style="font-size: x-large; text-align: right;">${value}</h6>`;
    } }catch{
      console.log("it is non-modified ")
      return;
    }
  }
  if(article ===""){
    return;
  }
  return article;
}


export default  buildArticle;