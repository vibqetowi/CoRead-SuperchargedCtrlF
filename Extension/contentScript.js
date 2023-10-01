const pineconeScript = document.createElement('script');
pineconeScript.src = 'https://unpkg.com/@pinecone-database/pinecone@0.3.0/dist/pinecone.min.js';
document.head.appendChild(pineconeScript);

pineconeScript.onload = async function () {
  const tfjsScript = document.createElement('script');
  tfjsScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.8.0/dist/tf.min.js';
  document.head.appendChild(tfjsScript);

  tfjsScript.onload = async function () {
    const tokenizerScript = document.createElement('script');
    tokenizerScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder@4.0.0/dist/universal-sentence-encoder.min.js';
    document.head.appendChild(tokenizerScript);

    tokenizerScript.onload = async function () {
      const numberedLines = function () {
        const text = document.body.innerText;
        let numberedText = text.split('\n')
        numberedText.split('\n').forEach(line => {

          if (line.length > 10) {
            numberedLines.push(line)
          }
        });


        console.log(numberedLines)
        return numberedLines
      }


      const name = document.head.title
      const pinecone = new Pinecone()
    }
  }
}








