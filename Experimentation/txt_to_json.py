import json

# Initialize an empty dictionary to store the reformatted data
reformatted_data = {
    'url': '',
    'passage_text': []
}

# Read the input text file line by line
with open('input.txt', 'r') as f:
    lines = f.readlines()

# The first line is assumed to be the URL
reformatted_data['url'] = lines[0].strip()

# The remaining lines are the passage texts
for line in lines[1:]:
    reformatted_data['passage_text'].append(line.strip())

# Write the reformatted data to a new JSON file
with open('output.json', 'w') as f:
    json.dump(reformatted_data, f, indent=4)

print("Data reformatted and saved to 'output.json'")
