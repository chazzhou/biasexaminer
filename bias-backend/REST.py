import threading
import asyncio
from flask import Flask, jsonify, request
from transformers import pipeline


print(f"In flask global level: {threading.current_thread().name}")
app = Flask(__name__)

@app.route("/RunTest", methods=["GET"])
def test():
    TestSentence = request.args.get('TestSentence')
    print(TestSentence)
    print(f"Inside flask function: {threading.current_thread().name}")
    asyncio.set_event_loop(asyncio.new_event_loop())
    loop = asyncio.get_event_loop()
    results = loop.run_until_complete(RoBERTA(TestSentence))
    return jsonify({"results": results})

async def RoBERTA(string):
    unmasker = pipeline('fill-mask', model='roberta-base')
    results = unmasker(string)
    return results


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4567, debug=False)