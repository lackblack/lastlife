function findDeathDate() {
  const birthdate = document.getElementById('birthdate').value;
  const formattedDate = new Date(birthdate);
  const month = formattedDate.getMonth() + 1;
  const day = formattedDate.getDate();

  fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/deaths/${month}/${day}`)
    .then(response => response.json())
    .then(data => {
      if (data.deaths && data.deaths.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.deaths.length);
        const lastLifeInfo = data.deaths[randomIndex];
        const lastLifeText = `On your birthday, someone like you passed away: ${lastLifeInfo.text}`;
        document.getElementById('lastLife').textContent = lastLifeText;
      } else {
        document.getElementById('lastLife').textContent = 'No matching death found on that day.';
      }
    })
    .catch(error => console.log(error));
}
