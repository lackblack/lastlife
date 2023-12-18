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
    
    # Construct a Wikipedia URL for deaths around the birthdate
    url = f'https://en.wikipedia.org/wiki/{birthdate}_in_deaths'
    response = requests.get(url)
    
    # Parse the HTML response
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find the section with the list of deaths
    deaths_section = soup.find('span', {'id': 'Deaths'})
    
    if deaths_section:
        # Look for the next ul (list) after the Deaths section
        list_of_deaths = deaths_section.find_next('ul')
        
        if list_of_deaths:
            # Extracting the first listed death name and link
            first_death = list_of_deaths.find('li')
            if first_death:
                name = first_death.find('a').text
                link = 'https://en.wikipedia.org' + first_death.find('a')['href']
                return jsonify({'name': name, 'link': link})
    
    return jsonify({'error': 'No historical figure found for this date.'})



if __name__ == '__main__':
    app.run(debug=True)
