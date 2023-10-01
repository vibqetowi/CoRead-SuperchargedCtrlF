const url = "https://1632-37-120-244-62.ngrok-free.app"

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


let linesAll = lines()
console.log(httpGet(`${url}/test_route`))
















