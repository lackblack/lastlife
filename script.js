function findDeathDate() {
  const birthdate = document.getElementById('birthdate').value;
  const formattedDate = new Date(birthdate);
  const birthYear = formattedDate.getFullYear();
  const month = formattedDate.getMonth() + 1;
  const day = formattedDate.getDate();

  fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/deaths/${month}/${day}`)
    .then(response => response.json())
    .then(data => {
      if (data.deaths && data.deaths.length > 0) {
        const deathsByYear = {};

        // Group deaths by year
        data.deaths.forEach(death => {
          const deathYear = death.year || new Date(death.death_date).getFullYear();
          if (!deathsByYear[deathYear]) {
            deathsByYear[deathYear] = [];
          }
          deathsByYear[deathYear].push(death);
        });

        // Sort by year, putting the user's birth year first
        const sortedYears = Object.keys(deathsByYear).sort((a, b) => {
          if (a === birthYear.toString()) return -1;
          if (b === birthYear.toString()) return 1;
          return a - b;
        });

        // Display deaths by year
        let resultText = '';
        sortedYears.forEach(year => {
          if (deathsByYear[year].length > 0) {
            resultText += `<b>${year}:</b><br>`;
            deathsByYear[year].forEach(death => {
              resultText += `${death.text}<br>`;
            });
          }
        });

        document.getElementById('lastLife').innerHTML = resultText;
      } else {
        document.getElementById('lastLife').textContent = 'No death events found on this day.';
      }
    })
    .catch(error => console.log(error));
}
