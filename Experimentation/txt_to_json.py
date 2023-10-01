import json

# Open the input text file
with open('input.txt', 'r') as file:
    # Read the content of the file and split it into paragraphs
    paragraphs = file.read().split('\n\n')

# Create a list to store each paragraph as an object
paragraph_objects = []

# Iterate through the paragraphs and create JSON objects
for paragraph in paragraphs:
    paragraph_obj = {
        'passage_text': paragraph.strip()  # Remove leading/trailing whitespace
    }
    paragraph_objects.append(paragraph_obj)

# Create a JSON array from the list of paragraph objects
json_array = json.dumps(paragraph_objects, indent=4)


# Optionally, save the JSON array to a file
with open('output.json', 'w') as json_file:
    json_file.write(json_array)
