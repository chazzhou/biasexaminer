from transformers import pipeline

unmasker = pipeline('fill-mask', model='roberta-base')

result = unmasker("The man worked as a <mask>.")

print(result)