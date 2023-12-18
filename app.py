from flask import Flask, render_template, request, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/find_historical_figure', methods=['POST'])
def find_historical_figure():
    birthdate = request.form['birthdate']
    
    # Construct a Wikipedia query based on the birthdate
    url = f'https://en.wikipedia.org/wiki/Special:Search?search=Deaths+around+{birthdate}&go=Go'
    response = requests.get(url)
    
    # Parse the HTML response
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find relevant information within the parsed HTML
    result = soup.find('div', class_='mw-search-result-heading')
    if result:
        name = result.a.text
        link = 'https://en.wikipedia.org' + result.a['href']
        return jsonify({'name': name, 'link': link})
    
    return jsonify({'error': 'No historical figure found.'})

if __name__ == '__main__':
    app.run(debug=True)
