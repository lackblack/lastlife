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
    
    # Format birthdate to match Wikipedia's date format
    formatted_date = birthdate.replace('-', '')
    
    # Construct the MediaWiki API URL for deaths around the birthdate
    url = f'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&titles={formatted_date}_deaths'
    response = requests.get(url)
    
    data = response.json()
    
    # Extracting information from the API response
    pages = data['query']['pages']
    first_page_id = next(iter(pages))
    
    if first_page_id != '-1':
        page = pages[first_page_id]
        name = page['title']
        extract = page['extract']
        link = f'https://en.wikipedia.org/wiki/{formatted_date}_deaths'
        
        return jsonify({'name': name, 'extract': extract, 'link': link})
    
    return jsonify({'error': 'No historical figure found for this date.'})




if __name__ == '__main__':
    app.run(debug=True)
