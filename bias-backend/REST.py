import threading
import asyncio
from flask import Flask, jsonify, request, make_response
from transformers import pipeline
import nltk
nltk.download('vader_lexicon') 
from nltk.sentiment.vader import SentimentIntensityAnalyzer

sid = SentimentIntensityAnalyzer()


print(f"In flask global level: {threading.current_thread().name}")
app = Flask(__name__)

@app.route("/RunTest", methods=["GET"])
def test():
    TestSentence = request.args.get('TestSentence')
    TargetWord = request.args.get('TargetWord')
    print(f"Inside flask function: {threading.current_thread().name} with Sentence {TestSentence} and Target {TargetWord}.")
    asyncio.set_event_loop(asyncio.new_event_loop())
    loop = asyncio.get_event_loop()
    results, emotion_lst = loop.run_until_complete(RoBERTA(TestSentence))
    for i in range(len(results)):
        results[i]["emotions"] = emotion_lst[i]
    resp = make_response(jsonify({"results": results,
                                    "target": TargetWord}), 200)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

async def RoBERTA(string):
    # add device=0 or 1 for GPU
    unmasker = pipeline('fill-mask', model='roberta-base',device=0)
    results = unmasker(string)
    emotion_lst = []
    for i in results:
        emotion_lst.append(sid.polarity_scores(i['sequence']))
    
    return results, emotion_lst


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4567, debug=False)