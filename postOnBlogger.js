import { google } from "googleapis";

async function publishToBlogger(title, content, img, authorize,label) {
  let auth;
  try {
    auth = await authorize();
  } catch (err) {
    console.log("Blogger Authorization failed:", err);
    return null;
  }

  let blogger;
  try {
    blogger = google.blogger({ version: "v3", auth });
  } catch (err) {
    console.log("Failed to init Blogger API:", err);
    return null;
  }

  const blogId = "8784583295316048833";
  const fullContent = `${img}\n\n${content}`;

  let res;
  try {
    res = await blogger.posts.insert({
      blogId,
      requestBody: {
        kind: "blogger#post",
        title,
        content: fullContent,
        labels:[label]
      },
    });
  } catch (err) {
    console.log("Error publishing post:", err);
    return null;
  }

  console.log("✅ Post published:", res.data.url);
  return res.data.url;
}

export default publishToBlogger;
