import { useState } from "react";
import "./App.css";
import { languages } from "./languages";
import { getFarewellText, getRandomWord } from "./utils";
import Header from "./Header";
import Confetti from "react-confetti";
import { clsx } from "clsx";

function App() {
  const [currentWord, setCurrentWord] = useState(getRandomWord());
  const [addedLetter, setAddedLetter] = useState([]);

  const numLetterLeft = languages.length - 2;
  const wrongLetterCount = addedLetter.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  const isLastLetterIncorrect =
    addedLetter.length > 0 && !currentWord.includes(addedLetter.at(-1));
  const isGameWon = currentWord
    .split("")
    .every((letter) => addedLetter.includes(letter));
  const isGameLost = wrongLetterCount > numLetterLeft;
  const isGameOver = isGameLost || isGameWon;
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function addNewLetter(letter) {
    setAddedLetter((prev) =>
      prev.includes(letter) ? prev : [...prev, letter]
    );
  }

  function startNewGame() {
    setCurrentWord(getRandomWord());
    setAddedLetter([]);
  }
  const statusContent = renderGameStatus();

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    active: isLastLetterIncorrect && !isGameOver,
  });
  function renderGameStatus() {
    if (!isGameOver && isLastLetterIncorrect) {
      return <>{getFarewellText(languages[wrongLetterCount - 1]?.name)}</>;
    }
    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      );
    }
    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      );
    }
    return null;
  }

  const languageElements = languages.map((el, index) => {
    const isLost = index < wrongLetterCount;

    const styles = {
      backgroundColor: el.backgroundColor,
      color: el.color,
    };
    const className = clsx("language", isLost && "lost");
    return (
      <span className={className} key={el.name} style={styles}>
        {el.name}
      </span>
    );
  });
  const letterElements = currentWord.split("").map((letter, index) => {
    const letterClassName = clsx(
      isGameLost && !addedLetter.includes(letter) && "missed-letter"
    );
    return (
      <span key={index} className={letterClassName}>
        {addedLetter.includes(letter) || isGameLost ? letter.toUpperCase() : ""}
      </span>
    );
  });

  const keyboardElements = alphabet.split("").map((el) => {
    const isGuessed = addedLetter.includes(el);
    const isCorrect = isGuessed && currentWord.includes(el);
    const isWrong = isGuessed && !currentWord.includes(el);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });
    return (
      <button
        key={el}
        onClick={() => addNewLetter(el)}
        disabled={isGameOver}
        className={className}
      >
        {el.toUpperCase()}
      </button>
    );
  });

  return (
    <>
      {isGameWon && <Confetti />}
      <Header />
      <main>
        <section className="languages">{languageElements}</section>
        <section className={gameStatusClass}>{statusContent}</section>
        <section className="word">{letterElements}</section>

        <section className="keyboard">{keyboardElements}</section>
        {isGameOver && (
          <button className="new-game" onClick={startNewGame}>
            New Game
          </button>
        )}
      </main>
    </>
  );
}

export default App;
