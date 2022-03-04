import json
 
# Opening JSON file
f = open('response1.json')
 
# returns JSON object as
# a dictionary
data = json.load(f)
 
words = {}

# Iterating through the json
# list
for i in data:
    for response in i:
        
        if response['token_str'] not in words:
            words[response['token_str']] = 1
        else: 
            words[response['token_str']] += 1
print(words)
# Closing file
f.close()