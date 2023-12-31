function findDeathDate() {
  const birthdate = document.getElementById('birthdate').value;
  const formattedDate = new Date(birthdate);
  const birthYear = formattedDate.getFullYear();
  const month = formattedDate.getMonth() + 1;
  const day = formattedDate.getDate();

  fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/deaths/${month}/${day}`)
    .then(response => response.json())
    .then(async data => {
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
          const resultText = `<div><i>Somebody died on the day you were born.</i></div><br><b>${selectedYear}:</b><br>${(await Promise.all(deathsByYear[selectedYear].map(async death => {
            let imageUrl = '';
            let pageTitle = '';
            if (death.pages && death.pages[0]) {
              pageTitle = death.pages[0].title.replace(/ /g, '_');
              const imageResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${pageTitle}`);
              const imageData = await imageResponse.json();
              imageUrl = imageData.originalimage ? imageData.originalimage.source : '';
            }
            return `<div style="display: flex; justify-content: center; align-items: center; flex-direction: column; text-align: center;">
              <img src="${imageUrl}" width="100" height="100" style="margin-bottom: 10px;">
              <div>${death.text} <a href="https://en.wikipedia.org/wiki/${pageTitle}" target="_blank" rel="noopener noreferrer">(Read more on Wikipedia)</a></div>
            </div>`;
          }))).join('<br>')}`;

          document.getElementById('lastLife').innerHTML = resultText;

          const deathInfo = deathsByYear[selectedYear];
          if (deathInfo.length > 0) {
            const person = deathInfo[0];
            const deathDate = person.death_date ? new Date(person.death_date) : null;
            const personBirthDate = person.birth_date ? new Date(person.birth_date) : null;

            let personAgeAtDeath = null;
            if (deathDate && personBirthDate) {
              personAgeAtDeath = deathDate.getFullYear() - personBirthDate.getFullYear();
            }

            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const userAge = currentYear - formattedDate.getFullYear();
            const additionalInfoElement = document.getElementById('additionalInfo');
            if (personAgeAtDeath !== null && personAgeAtDeath > 0) {
              additionalInfoElement.textContent = `The person who died on your birthday was about ${personAgeAtDeath} years old. `;
            }
            additionalInfoElement.textContent += `You are currently ${userAge} years old.`;
          }
        } else {
          document.getElementById('lastLife').textContent = 'No recorded deaths on your birth year or the closest year available.';
        }
      } else {
        document.getElementById('lastLife').textContent = 'No death events found on this day.';
      }
    })
    .catch(error => console.log(error));
}
