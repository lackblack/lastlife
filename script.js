function findPerson() {
  const birthdate = document.getElementById('birthdate').value;
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=peoplewhothisdatepassedaway&pwtdpadate=${birthdate}&format=json`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(data => {
      // Handle the response data
      console.log(data); // Log the retrieved data to inspect in the browser console
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('result').innerHTML = "An error occurred while fetching data. Please check the console for more details.";
    });
}
 else {
        document.getElementById('result').innerHTML = "No historical figures found for this date.";
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('result').innerHTML = "An error occurred while fetching data.";
    });
}
