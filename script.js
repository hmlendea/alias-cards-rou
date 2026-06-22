function selectRandomCard() {
    const keys = Object.keys(cards);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    const selectedCard = cards[randomKey];

    for (let word in selectedCard) {
      const wordText = selectedCard[word];
      const encodedQuery = encodeURIComponent('Definiție: ' + wordText);
      const url = 'https://search.nucilandia.ro?q=' + encodedQuery;
      $('#' + word + ' .word-text')
        .html('<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + $('<span>').text(wordText).html() + '</a>');
    }
}

$(document).ready(function() {
    selectRandomCard();
});
