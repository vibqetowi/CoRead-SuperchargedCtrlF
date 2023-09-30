chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'scan') {
      scanAndHighlightText();
    }
  });
  
  function scanAndHighlightText() {
    const allTextNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  
    let node;
    while ((node = allTextNodes.nextNode())) {
      // Perform your scanning and highlighting logic here
      // For simplicity, let's just highlight the word "example"
      const regex = /\bexample\b/gi;
      const replacedText = node.nodeValue.replace(regex, '<span style="background-color: yellow;">$&</span>');
      if (replacedText !== node.nodeValue) {
        const span = document.createElement('span');
        span.innerHTML = replacedText;
        node.replaceWith(span);
      }
    }
  }
  