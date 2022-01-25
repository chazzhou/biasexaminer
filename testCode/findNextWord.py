# next_word_test.py

import torch
from transformers import AutoModelForCausalLM, \
  AutoTokenizer
# from torch import nn
import numpy as np

print("\nBegin next-word using HF GPT-2 demo ")

toker = AutoTokenizer.from_pretrained("gpt2")
model = AutoModelForCausalLM.from_pretrained("gpt2")

seq = "Chicago is full of"
print("\nInput sequence: ")
print(seq)

inpts = toker(seq, return_tensors="pt")
print("\nTokenized input data structure: ")
print(inpts)

inpt_ids = inpts["input_ids"]  # just IDS, no attn mask
print("\nToken IDs and their words: ")
for id in inpt_ids[0]:
  word = toker.decode(id)
  print(id, word)

with torch.no_grad():
  logits = model(**inpts).logits[:, -1, :]
print("\nAll logits for next word: ")
print(logits)
print(logits.shape)

pred_id = torch.topk(logits, 20)
print("\nPredicted token ID of next word: ")
print(pred_id)


for word in pred_id[1]:
  pred_word = toker.decode(word)
  print("\nPredicted next word for sequence: ")
  print(pred_word)

#pred_word = toker.decode(pred_id)
#print("\nPredicted next word for sequence: ")
#print(pred_word)

print("\nEnd demo ")