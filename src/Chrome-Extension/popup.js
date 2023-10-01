const submitBtn = document.getElementById("submitBtn");
const theUrl = "http://127.0.0.1:5000"

submitBtn.addEventListener("click", async () => {
    const sentenceInput = document.getElementById("sentenceInput").value;
    const newDiv = document.createElement("div");
    const meanwhile = document.createElement('div')
    meanwhile.innerHTML = 'Loading...'
    document.body.appendChild(meanwhile)

    const citationsTitle = document.createElement("p");
    citationsTitle.innerHTML = "Citations:"
    const citations = document.createElement('ul')

    const confidence = document.createElement("p");
    const separation = document.createElement("p");
    separation.innerHTML = "------------------------------------"

    const formData = new FormData();
    formData.append('search_query', sentenceInput);

    try {
        const response = await postData(theUrl, formData);
        console.log('Response:', response);

        newDiv.innerHTML = response.answer; // Assuming the response has a property 'search_result'

        response.citations.forEach(citation => {
            const citationLi = document.createElement('li')
            citationLi.innerHTML = citation
            citations.appendChild(citationLi)
        })

        confidence.innerHTML = "Confidence: " + (response.confidence * 100).toPrecision(2) + "%"
        document.body.appendChild(separation);
        document.body.appendChild(newDiv);
        document.body.appendChild(confidence);
        document.body.appendChild(citationsTitle)
        document.body.appendChild(citations)
    } catch (error) {
        console.error('Error:', error);
    }
});

async function postData(url = '', data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'ngrok-skip-browser-warning': 'true',
            'Access-Control-Allow-Origin': '*'  // Note: This is a response header, not a request header
        },
        body: data
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    return responseData;
}
