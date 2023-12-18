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

        // Find the closest available year to the past if no deaths in the birth year
        let selectedYear = birthYear;
        while (!deathsByYear[selectedYear] && selectedYear >= 0) {
          selectedYear--;
        }

        if (deathsByYear[selectedYear] && deathsByYear[selectedYear].length > 0) {
          const resultText = `<b>${selectedYear}:</b><br>${deathsByYear[selectedYear].map(async death => {
            let imageUrl = '';
            if (death.pages && death.pages[0]) {
              const pageTitle = death.pages[0].title.replace(/ /g, '_');
              const imageResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${pageTitle}`);
              const imageData = await imageResponse.json();
              imageUrl = imageData.originalimage ? imageData.originalimage.source : '';
            }
            return `<div><img src="${imageUrl}" width="100" height="100">${death.text}</div>`;
          }).join('<br>')}`;
          document.getElementById('lastLife').innerHTML = resultText;
        } else {
          document.getElementById('lastLife').textContent = 'No recorded deaths on your birth year or the closest year available.';
        }
      } else {
        document.getElementById('lastLife').textContent = 'No death events found on this day.';
      }
    })
    .catch(error => console.log(error));
}
