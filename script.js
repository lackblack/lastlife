function getNewArticle() {
  fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary')
    .then(response => response.json())
    .then(data => {
      const articleContent = document.getElementById('article-content');
      articleContent.textContent = data.extract;
    })
    .catch(error => console.log(error));
}

function checkGuess() {
  const userGuess = document.getElementById('user-guess').value.toLowerCase();
  const articleContent = document.getElementById('article-content').textContent.toLowerCase();

  const result = document.getElementById('result');
  if (articleContent.includes(userGuess)) {
    result.textContent = 'Correct! You guessed it right.';
  } else {
    result.textContent = 'Oops! Try again.';
  }
}
