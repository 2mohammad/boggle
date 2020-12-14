from boggle import Boggle
from word_find import Map
from flask import Flask, request, render_template, redirect, flash, jsonify, json, make_response, session
from flask_debugtoolbar import DebugToolbarExtension

boggle_game = Boggle()
app = Flask(__name__)
word_finder = Map()

app.config['SECRET_KEY'] = "psswd"
debug = DebugToolbarExtension(app)
app.config['DEBUG_TB_INTERCEPTS_REDIRECTS'] = False
game_board = ""
file_name = "words.txt"
score = 0
word_list = []
times_played = 0

    



@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/api')
def api():
    game_board = jsonify(boggle_game.make_board())
    return game_board

@app.route('/word', methods=['GET'])
def word():
    content = request.args['word'].lower()
    found = (word_finder.find_word(file_name, content))
    global times_played
    global score
    if found == -1:
        times_played+=1
        return jsonify(times_played=times_played, found=found, content=content, word_list=word_list, score=score)
    else:
        if content in word_list:
            times_played+=1
            return jsonify(times_played=times_played, found=found, content=content, word_list=word_list, score=score)
        else:
            times_played+=1
            word_list.append(content)
            score = score + len(content)
            return jsonify(times_played=times_played, found=found, content=content, word_list=word_list, score=score)

