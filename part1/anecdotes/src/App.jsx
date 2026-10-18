import { useState } from "react";

function App() {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];
  const initialVotes = Array.from(anecdotes, () => 0);
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(initialVotes);
  const mostVotesIdx = findMostVotesIndex(votes);

  function handleNext() {
    const randomInt = getRandomInt(0, anecdotes.length);
    setSelected(randomInt);
  }

  function handleVote() {
    const newNotes = [...votes];
    newNotes[selected] += 1;
    setVotes(newNotes);
  }

  return (
    <div>
      <h1>Anecdotes of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>

      <button onClick={handleVote}>vote</button>
      <button onClick={handleNext}>next anecdote</button>

      <h1>Anecdotes with the most votes</h1>
      <p>{anecdotes[mostVotesIdx]}</p>
      <p>has {votes[mostVotesIdx]} votes</p>
    </div>
  );
}

export default App;

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function findMostVotesIndex(arr) {
  let mostVotes = 0;
  let mostVotesIdx = 0;

  arr.forEach((vote, i) => {
    if (vote > mostVotes) {
      mostVotes = vote;
      mostVotesIdx = i;
    }
  });

  return mostVotesIdx;
}
