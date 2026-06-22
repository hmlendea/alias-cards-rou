function selectRandomCard() {
    const keys = Object.keys(cards);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    const selectedCard = cards[randomKey];

    for (let word in selectedCard) {
      const wordText = selectedCard[word];
      const parts = wordText.trim().split(/\s+/);
      const useShortQuery = parts.length === 1 || (parts.length === 2 && parts[0].toLowerCase() === 'a');
      const query = useShortQuery ? wordText + ' DEX' : 'Definiție: ' + wordText;
      const encodedQuery = encodeURIComponent(query);
      const url = 'https://search.nucilandia.ro?q=' + encodedQuery;
      $('#' + word + ' .word-text')
        .html('<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + $('<span>').text(wordText).html() + '</a>');
    }
}

$(document).ready(function() {
    selectRandomCard();
});
