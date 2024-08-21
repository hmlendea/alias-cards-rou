function selectRandomCard() {
    const keys = Object.keys(cards);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    const selectedCard = cards[randomKey];

    for (let word in selectedCard) {
      $('#' + word + ' .word-text').text(selectedCard[word]);
    }
}

$(document).ready(function() {
    selectRandomCard();
});
