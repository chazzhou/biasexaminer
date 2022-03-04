import threading
import asyncio
from flask import Flask, jsonify, request, make_response
from transformers import pipeline


print(f"In flask global level: {threading.current_thread().name}")
app = Flask(__name__)

@app.route("/RunTest", methods=["GET"])
def test():
    TestSentence = request.args.get('TestSentence')
    TargetWord = request.args.get('TargetWord')
    print(f"Inside flask function: {threading.current_thread().name} with Sentence {TestSentence} and Target {TargetWord}.")
    asyncio.set_event_loop(asyncio.new_event_loop())
    loop = asyncio.get_event_loop()
    results = loop.run_until_complete(RoBERTA(TestSentence))
    resp = make_response(jsonify({"results": results,
                                    "target": TargetWord}), 200)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

async def RoBERTA(string):
    # add device=0 or 1 for GPU
    unmasker = pipeline('fill-mask', model='roberta-base', device=0)
    results = unmasker(string)
    return results


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4567, debug=False)