# %%
# Install Dependencies
import cohere
import pandas as pd
from tqdm import tqdm
import threading
from pyngrok import ngrok
from werkzeug.serving import make_server
from flask import Flask, request, jsonify, make_response
from pprint import pprint
from config import *
import pinecone
import torch
from sentence_transformers import SentenceTransformer
from transformers import BartTokenizer, BartForConditionalGeneration
# %pip install - qU datasets pinecone-client sentence-transformers torch pyngrok cohere

# %%

#Connect to vector DB
pinecone.init(
    api_key=PINECONE_API_KEY,
    environment="gcp-starter"
)
#basically a table in a db except it's not sql, hardcoded here because
# free plan only lets you make one anyways
index = pinecone.Index('genghis-khan')

# set device to GPU if available
device = 'cuda' if torch.cuda.is_available() else 'cpu'


# load the retriever model from huggingface model hub
retriever = SentenceTransformer(
    "flax-sentence-embeddings/all_datasets_v3_mpnet-base", device=device)
retriever


# load generator model from huggingface
tokenizer = BartTokenizer.from_pretrained('vblagoje/bart_lfqa')
generator = BartForConditionalGeneration.from_pretrained(
    'vblagoje/bart_lfqa').to(device)


# %%
# Helper functions for retrieval and answering

# returns the k vectors that most match the query in vector db

def query_pinecone(query, top_k):
    # generate embeddings for the query
    query = retriever.encode([query]).tolist()
    # return relevant context vecros from query
    context = index.query(query, top_k=top_k, include_metadata=True)
    return context


# this function checks if relevant passages for the query exists
# pinecone gives a "score" metric which shows vector similarity
def check_relevancy(query):
    query = retriever.encode([query]).tolist()
    context = index.query(query, top_k=1, include_metadata=True)

    # Access the score value
    score = context['matches'][0]['score']

    return score


def generate_answer(query, context):
    # extract passage_text from Pinecone search result and add the <P> tag
    context = [f"<P> {m['metadata']['passage_text']}" for m in context]
    # concatinate all context passages
    context = " ".join(context)

    # contcatinate the query and context passages
    input_text = f"question: {query} context: {context}"

    # tokenize the query to get input_ids
    input_tokens = tokenizer([input_text], max_length=1024,
                             return_tensors="pt").to(device)

    # use generator to predict output ids
    ids = generator.generate(
        input_tokens["input_ids"], num_beams=2, min_length=20, max_length=100)

    # use tokenizer to decode the output ids
    answer = tokenizer.batch_decode(
        ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)[0]
    return answer


# %%
# Import modules

# Create App
app = Flask(__name__)
CORS(app)

def run_app():
    global server
    server = make_server('127.0.0.1', 5000, app)
    server.serve_forever()


# %%
# Define Routes


@app.route("/")
def home():
    return "Api works!"


@app.route("/test_route")
def test_route():
    return jsonify("test")


@app.route('/ask', methods=['POST'])
def ask():
    try:
        if request.method == 'POST':
            # Get the search query from the form
            query = request.form['search_query']

            context = query_pinecone(query, top_k=3)
            #debug statement to view context and scores
            print(context)

            relevancy_of_text = check_relevancy(query)
            if relevancy_of_text > 0.6:
                matching_context = context["matches"]
                answer = generate_answer(query, matching_context)
                citations = [doc["metadata"]['passage_text']
                             for doc in matching_context]
                answer = answer[0]['text']
                return jsonify({"answer": answer, "citations": citations, "confidence": relevancy_of_text})
            else:
                return jsonify({"message": "No relevant text found"})

    except Exception as e:
        print("An error occurred: ", e)
        return jsonify({'error': 'Internal Server Error'}), 500


@app.route('/ask_cohere', methods=['POST'])
def ask_cohere():
    try:
        if request.method == 'POST':
            # Get the search query from the form
            query = request.form['search_query']

            context = query_pinecone(query, top_k=3)
            #debug statement to view context and scores
            # print(context)

            relevancy_of_text = check_relevancy(query)
            if relevancy_of_text > 0.6:
                matching_context = context["matches"]
                citations = [doc["metadata"]['passage_text']
                             for doc in matching_context]

                co = cohere.Client(COHERE_API_KEY)
                answer = co.generate(
                    prompt=f"answer this question: {query}\n based on this text {citations}",
                    stream=False, max_tokens=99, presence_penalty=0.3
                )

                # print(type(answer))
                # print(dir(answer[0]))
                # pprint(answer)

                answer = answer[0].text

                return jsonify({"answer": answer, "citations": citations, "confidence": relevancy_of_text})
            else:
                return jsonify({"message": "No relevant text found"})

    except Exception as e:
        print("An error occurred: ", e)
        return jsonify({'error': 'Internal Server Error'}), 500


@app.route('/vectorize_page', methods=['POST'])
# performance: the genghis khan wikipedia page takes around 40 secs
def vectorize_page():
    try:
        # Get the JSON data from the request body
        data = request.json
        print("data: " + str(data))

        # Check if 'url' key exists in the JSON data
        if 'name' not in data:
            return jsonify({'error': 'The JSON data must contain a "name" key'}), 400

        index_name = data['name']

        if index_name not in pinecone.list_indexes():
            pinecone.create_index(
                index_name,
                dimension=768,
                metric="cosine"
            )

        index = pinecone.Index(index_name)

        if 'passage_text' not in data:
            return jsonify({'error': 'No passages found'}), 400

        passage_texts = data['passage_text']
        df = pd.DataFrame({'passage_text': passage_texts})

        # Drop rows with less than 2 words
        df = df[df['passage_text'].apply(lambda x: len(x.split()) >= 2)]

        batch_size = len(df)
        emb = retriever.encode(df["passage_text"].tolist()).tolist()
        meta = df.to_dict(orient="records")
        ids = [f"{idx}" for idx in range(len(df))]
        to_upsert = list(zip(ids, emb, meta))

        index = pinecone.Index(index_name)

        for i in tqdm(range(len(to_upsert))):
            _ = index.upsert(vectors=[to_upsert[i]])

        index_stats = index.describe_index_stats()
        return jsonify({'message': f'{index_name} vectorized'})

    except Exception as e:
        print("An error occurred: ", e)
        return jsonify({'error': 'Internal Server Error'}), 500


# %%
# launch server
flask_thread = threading.Thread(target=run_app)
flask_thread.start()

# Open an ngrok tunnel to the HTTP server
public_url = ngrok.connect(5000)
print(" * ngrok tunnel \"{}\" -> \"http://127.0.0.1:5000\"".format(public_url))


# %%


# %%
# # Shutdown Api
# if server:
#     server.shutdown()
# # Disconnect the ngrok tunnel
# ngrok.disconnect(public_url)
