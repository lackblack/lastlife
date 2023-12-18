function findDeathDate() {
  const birthdate = document.getElementById('birthdate').value;
  const formattedDate = new Date(birthdate);
  const birthYear = formattedDate.getFullYear();
  const month = formattedDate.getMonth() + 1;
  const day = formattedDate.getDate();

  fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/deaths/${month}/${day}`)
    .then(response => response.json())
    .then(data => {
      if (data.deaths && data.deaths[0] && data.deaths[0].year === birthYear) {
        const matchingDeaths = data.deaths.filter(death => death.year === birthYear);

        if (matchingDeaths.length > 0) {
          const randomIndex = Math.floor(Math.random() * matchingDeaths.length);
          const lastLifeInfo = matchingDeaths[randomIndex];
          const lastLifeText = `On your birthday, someone like you passed away: ${lastLifeInfo.text}`;
          document.getElementById('lastLife').textContent = lastLifeText;
        } else {
          document.getElementById('lastLife').textContent = 'No recorded deaths on your birthday in your birth year.';
        }
      } else {
        document.getElementById('lastLife').textContent = 'No death events found on this day in your birth year.';
      }
    })
    .catch(error => console.log(error));
}
