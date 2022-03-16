from transformers import pipeline

print("Please use <mask> to identify the word you want the model to fill.")

userinput = str(input())

print("You entered: " + userinput)
print("Running...")

unmasker = pipeline('fill-mask', model='roberta-large', device=0)

results = unmasker(userinput)

print(results)

print("END")
