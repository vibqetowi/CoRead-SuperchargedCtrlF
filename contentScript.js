const pineconeScript = document.createElement('script');
pineconeScript.src = 'https://unpkg.com/@pinecone-database/pinecone@0.3.0/dist/pinecone.min.js';
document.head.appendChild(pineconeScript);

const tfjsScript = document.createElement('script');
tfjsScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.8.0/dist/tf.min.js';
document.head.appendChild(tfjsScript);

const tokenizerScript = document.createElement('script');
tokenizerScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder@4.0.0/dist/universal-sentence-encoder.min.js';
document.head.appendChild(tokenizerScript);

pineconeScript.onload = async function () {
  tfjsScript.onload = async function () {
    tokenizerScript.onload = async function () {
      const Pinecone = window.Pinecone;
      const loadTokenizer = window['universal-sentence-encoder'].loadTokenizer;
      const numberedLines = function () {
        const text = document.body.innerText;
        let numberedText = text.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n')
        let numberedLines = []

        numberedText.split('\n').forEach(line => {

          if (line.length > 10) {
            numberedLines.push(line)
          }
        });


        console.log(numberedLines)
        return numberedLines
      }


      const name = document.head.title
      const pinecone = new Pinecone();

      await pinecone.init({
        environment: "gcp-starter",
        apiKey: "1ff3957c-24e8-4a00-9037-34a4fd541813",
      });

      await pinecone.createIndex({
        name: name,
        dimension: 512,
        waitUntilReady: true,
      });

      await pinecone.describeIndex(name);
      const index = pinecone.index(name)

      let encodedLines = []

      numberedLines.forEach(line => {
        loadTokenizer().then(tokenizer => {
          encodedLines.push(tokenizer.encode(line));
        })
      });

      let count = 0
      encodedLines.forEach(async encodedLine => {
        await index.upsert([{
          "id": count,
          "values": encodedLine
        }])
        count++;
      })

      console.log(encodedLines)



    }
  }
}








