from flask import Flask, request, jsonify
import gradio as gr

app = Flask(__name__)

def respond(input_text):
    iface = gr.Interface.load("models/Tap-M/Luna-AI-Llama2-Uncensored")
    return iface.predict(input_text)

@app.route('/get_response', methods=['POST'])
def get_response():
    user_input = request.json['user_input']
    response = respond(user_input)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(port=5000)
