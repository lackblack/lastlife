function findPerson() {
  const birthdate = document.getElementById('birthdate').value;
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=peoplewhothisdatepassedaway&pwtdpadate=${birthdate}&format=json`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.query && data.query.peoplewhothisdatepassedaway.length > 0) {
        const pageId = data.query.peoplewhothisdatepassedaway[0].pageid;
        const articleUrl = `https://en.wikipedia.org/?curid=${pageId}`;
        document.getElementById('result').innerHTML = `<a href="${articleUrl}" target="_blank">Discover Who You Were</a>`;
      } else {
        document.getElementById('result').innerHTML = "No historical figures found for this date.";
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('result').innerHTML = "An error occurred while fetching data.";
    });
}
