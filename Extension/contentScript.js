const url = "https://22c3-37-120-244-62.ngrok-free.app"

const lines = function () {
  const text = document.body.innerText;
  let textArr = text.split('\n')
  let finalLines = []
  textArr.forEach(line => {

    if (line.length > 10) {
      finalLines.push(line)
    }
  });
  console.log(finalLines)
  return finalLines
}

function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", theUrl, false);
  xmlHttp.setRequestHeader('Access-Control-Allow-Origin', '*')
  xmlHttp.setRequestHeader("ngrok-skip-browser-warning", 'true')
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

function httpPost(theUrl, data, callback) {
  return new Promise((resolve, reject) => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", url, true);
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.setRequestHeader("ngrok-skip-browser-warning", "true");

    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState === XMLHttpRequest.DONE) {
        if (xmlHttp.status === 200) {
          resolve(JSON.parse(xmlHttp.responseText));
        } else {
          reject(`HTTP request failed with status ${xmlHttp.status}`);
        }
      }
    };

    xmlHttp.send(JSON.stringify(data));
  });
}

let linesAll = lines()
const timeout = 30000; // 30 seconds
let timeoutId;
let data = {
  name: 'genghis-khan',
  passage_text: linesAll
}

const httpRequestPromise = httpPost(`${url}/vectorize_page`, data);
const timeoutPromise = new Promise((resolve, reject) => {
  timeoutId = setTimeout(() => {
    clearTimeout(timeoutId);
    reject('Request timed out');
  }, timeout);
});


Promise.race([httpRequestPromise, timeoutPromise])
  .then(response => {
    clearTimeout(timeoutId);
    console.log('Response:', response);
  })
  .catch(error => {
    clearTimeout(timeoutId);
    console.error('Error:', error);
  });















