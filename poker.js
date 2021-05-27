const test = getFile(process.argv);
const testObject = getObject(test);
const suits = ["♣", "♦", "♥", "♠"];
const names  =["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
let deckOfCards = [];
let hand = assignHand(testObject);

main();

                              /***Fuctions***/

/***************************Main Deck Section***************************/

function main() {
    if (hand.cards.length !== 5) {
      createCardDeck()
      shuffleDeck();
      serve();
    }
    evaluateHand();
    printHand();
    console.log("You have: " + determineHand(hand.cards));
}

/***************************Handle Deck Section***************************/

//Create a deck of cards that conatains the symbol and ranking of a card
function createCardDeck() {
  for (var i = 0; i < names.length; i++) {
    for (var j = 0; j < suits.length; j++) {
      let newCard = {name: names[i]+suits[j], rank: i + 1, suit: suits[j]};
      deckOfCards.push(newCard)
    }
  }
}

//Shuffle the deck
function shuffleDeck() {
  for (var i = 0; i < deckOfCards.length; i++) {
    let randomIndex = Math.floor(Math.random() * (52));
    let temp = deckOfCards[i];
    deckOfCards[i] = deckOfCards[randomIndex];
    deckOfCards[randomIndex] = temp;
  }
}

//serve hand
function serve() {
  for (var i = 0; i < 5; i++) {
    hand.cards.push(deckOfCards[i]);
    hand.cards.sort((a, b) => (a.rank > b.rank) ? 1 : -1)
  }

}

function printHand() {
  let message = "Your hand: ";
  for (var i = 0; i < hand.cards.length; i++) {
    message = message + hand.cards[i].name + " ";
  }
  console.log(message.trim());
}

/***************************Evaluate Hand Section***************************/

//Determine the kind of hand the cards make
function determineHand() {
  if (hand.rankPairs.length === 1)
    return "Five of a kind";
  else if (isSequential() && hand.suitPairs.length === 1)
    return "Straight flush";
  else if (hand.rankPairs[0].count === 4 || hand.rankPairs[1].count === 4)
    return "Four of a kind";
  else if (hand.rankPairs.length === 2 && (hand.rankPairs[0].count === 3 || hand.rankPairs[1].count === 3))
    return "Full house";
  else if (hand.suitPairs.length === 1)
    return "Flush";
  else if (isSequential())
    return "Straight";
  else if (hand.rankPairs[0].count === 3 || hand.rankPairs[1].count === 3 || hand.rankPairs[2].count === 3)
    return "Three of a kind";
  else if (countRankPairs() === 2)
    return "Two Pair";
  else if (countRankPairs() === 1)
    return "One Pair";
  else
    return "High card"
}

//Evaluate hand by finding commonalities, in ranks and suits, save these
//Save these in rank Pairs and suit Pairs respectively
function evaluateHand() {
  for (var i = 0; i < hand.cards.length; i++) {
    let card = hand.cards[i];
    if (hand.rankPairs.findIndex((object => object.rank == card.rank)) == -1)
        hand.rankPairs.push({rank: card.rank, count: sameRanks(card.rank)});
    if (hand.suitPairs.findIndex((object => object.symbol == assignLetter(card.suit))) == -1)
        hand.suitPairs.push({rank: card.suit, count: sameSuit(card.suit), symbol: assignLetter(card.suit)});
  }
}

//Count the number of card that have similar Ranks
function sameRanks(rank) {
  let i = 0;
  let count = 0;

  while (i < hand.cards.length) {
    if (hand.cards[i].rank === rank)
      count++;
    i++
  }
  return count;
}

//Count the number of card that have similar Ranks
function sameSuit(suit) {
  let i = 0;
  let count = 0;

  while (i < hand.cards.length) {
    if (hand.cards[i].suit === suit)
      count++;
    i++
  }
  return count;
}

//Check if the deck is is sequentail Calculate the differnce in the array of each card ranking
function isSequential() {
  let i = 0;

  while (i < hand.cards.length - 1) {
    if (hand.cards[i].rank + 1 !== hand.cards[i + 1].rank)
      return false;
    i++
  }
  return true
}

//Extras

//findInde cannot find suit symbols so assign a value for each
function assignLetter(suit) {
  "♣", "♦", "♥", "♠"
  if (suit === "♣")
    return "C";
  else if (suit === "♦")
    return "D";
  else if (suit === "♥")
    return "H";
  else
    return "S";
}

//Some hands depend on the number of pairs that exist in a hand.Count the number of rank pairs
function countRankPairs() {
  let count = 0;
  for (var i = 0; i < hand.rankPairs.length; i++) {
    if (hand.rankPairs[i].count > 1)
      count++;
  }
  return count;
}

//Get the argument value(file)
function getFile(file) {
  if (file.length === 3)
    return file.slice(2);
  return null;
}

//Get hand object from the file
function getObject(testFile) {
  let file = null;
  try {
    file = require(`./hands/${test}`);
  } catch (err) {
      //console.log("Error: "+err.message);
  }
  return file;
}

//Initialise Hand
function assignHand(object) {
  if (!object)
    return {cards:[], rankPairs: [], suitPairs: []};
  return object;
}
