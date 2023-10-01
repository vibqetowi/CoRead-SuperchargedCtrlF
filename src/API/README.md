
```markdown
# AI-Powered Question Answering API

This project is an AI-powered Question Answering API that uses a retriever model to find relevant text passages and a generator model to generate answers to questions based on those passages. Below are instructions on how to set up and use this API.

## Installation

To use this API, you'll need to install the following dependencies:

```bash
pip install - qU datasets pinecone-client sentence-transformers torch pyngrok cohere
```

## Citations

### Retriever Model

The retriever model converts text snippets into vectors and vice versa. The model used is a pretrained Sentence-BERT model.

- [Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks](https://arxiv.org/abs/1908.10084)
- Author: Nils Reimers and Iryna Gurevych
- Published in Proceedings of the 2019 Conference on Empirical Methods in Natural Language Processing

### Generator Model

This model is a generative AI that generates text upon input. The model used is BART pretrained for Q&A. This is associated to the `/ask` enpoint to run local models

- [LFQA](https://yjernite.github.io/lfqa.html)

### Generator API
We also used the Cohere generator API to give an option that works better even though it is proprietary, Cohere was extensively used at MAIS 2022
- [Cohere](https://cohere.com/)
  
### Tutorial

As we are beginners, a tutorial video titled "Open Source Generative AI in Question-Answering (NLP) using Python" by James Brigg was heavily utilized for the AI part.

- [Tutorial Video](https://invidious.private.coffee/watch?v=L8U-pm-vZ4c)

## Usage

The API provides the following endpoints:

- `/ask` and `/ask_cohere` for asking questions and getting answers.
- `/vectorize_page` for vectorizing text passages.

For detailed information on how to use these endpoints, refer to the code and documentation in this repository.


## Contact

For questions or issues, please contact the project owner.
```
