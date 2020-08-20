import json
from flask import Flask, render_template, request

app = Flask(__name__, static_folder="static")

word_replacements = json.load(open("word_replacements.json"))

@app.route("/update_replacements", methods=["POST"])
def update_replacements():
    global word_replacements
    print("New replacements are", request.json)
    if request.json == None:
        return "", 402
    word_replacements = request.json
    json.dump(word_replacements, open("word_replacements.json", 'w'))
    return "success", 200

@app.route("/get_replacements")
def get_replacements():
    return json.dumps(word_replacements)

@app.route("/")
def doit():
    return render_template("file.jinja")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
