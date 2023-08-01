import gradio as gr
import sys

def respond(input):
    iface = gr.Interface.load("models/Tap-M/Luna-AI-Llama2-Uncensored")
    return iface.predict(input)

print(respond(sys.argv[1]))
