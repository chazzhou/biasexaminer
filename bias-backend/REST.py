import threading
import asyncio
from flask import Flask, jsonify, request, make_response
from transformers import pipeline

from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson.natural_language_understanding_v1 import Features, EmotionOptions
authenticator = IAMAuthenticator('0kifij18Ny44Y0a16QCA4T5TPNQr3csezRVUKRlJxhfg')
natural_language_understanding = NaturalLanguageUnderstandingV1(
    version='2021-08-01',
    authenticator=authenticator
)

natural_language_understanding.set_service_url('https://api.us-east.natural-language-understanding.watson.cloud.ibm.com/instances/56fb6ec4-0b5f-41c8-b426-3a47c4cacdaf')


print(f"In flask global level: {threading.current_thread().name}")
app = Flask(__name__)

@app.route("/RunTest", methods=["GET"])
def test():
    TestSentence = request.args.get('TestSentence')
    TargetWord = request.args.get('TargetWord')
    print(TestSentence)
    print(TargetWord)
    print(f"Inside flask function: {threading.current_thread().name}")
    asyncio.set_event_loop(asyncio.new_event_loop())
    loop = asyncio.get_event_loop()
    results, emotion_lst = loop.run_until_complete(RoBERTA(TestSentence,TargetWord))
    for i in range(len(results)):
        results[i]["emotions"] = emotion_lst[i]
    resp = make_response(jsonify({"results": results}), 200)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

async def RoBERTA(string,TargetWord):
    unmasker = pipeline('fill-mask', model='roberta-base')
    results = unmasker(string)
    print(results)
    emotion_lst = []
    for i in results:
        response = natural_language_understanding.analyze(
            text =  i['sequence'],
            features = Features(emotion = EmotionOptions())).get_result()
        emotion_lst.append(list(response["emotion"]["document"]["emotion"].values()))
    
    return results, emotion_lst


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4567, debug=False)