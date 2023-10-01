import { Pinecone } from "@pinecone-database/pinecone";

const numberedLines = function () {
  const text = document.body.innerText;
  let numberedText = text.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n')
  let numberedLines = []

  numberedText.split('\n').forEach(line => {

    if (line.length > 10) {
      numberedLines.push(line)
    }
  });

  return numberedLines
}

const uuid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

const pinecone = new Pinecone();
await pinecone.init({
  environment: "gcp-starter",
  apiKey: "1ff3957c-24e8-4a00-9037-34a4fd541813",
});


await pinecone.createIndex({
  name: uuid,
  dimension: numberedLines.length,
  waitUntilReady: true,
});




const index = pinecone.Index("tutorial-question-answering");

