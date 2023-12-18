function findHistoricalFigure() {
    const birthdate = document.getElementById('birthdate').value;
    fetch('/find_historical_figure', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `birthdate=${birthdate}`
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById('result');
        if (data.error) {
            resultDiv.innerHTML = `<p>${data.error}</p>`;
        } else {
            resultDiv.innerHTML = `
                <p>Closest historical figure: ${data.name}</p>
                <p>Description: ${data.extract}</p>
                <p><a href="${data.link}" target="_blank">Link to Wikipedia</a></p>
            `;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
