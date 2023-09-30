const getText = function () {
  const text = document.body.innerText;
  let numberedText = text.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n')
  console.log(numberedText);
  let numberedLines = numberedText.split('\n')

  numberedLines.forEach(element => {

  });
}
getText();
