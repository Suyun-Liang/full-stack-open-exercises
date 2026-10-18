import { useState } from "react";

function App() {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  function increaseGood() {
    setGood(good + 1);
  }
  function increaseNeutral() {
    setNeutral(neutral + 1);
  }
  function increaseBad() {
    setBad(bad + 1);
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" onClick={increaseGood} />
      <Button text="neutral" onClick={increaseNeutral} />
      <Button text="bad" onClick={increaseBad} />
      <h2>statistics</h2>
      <Statistics goodNum={good} badNum={bad} neutralNum={neutral} />
    </div>
  );
}

export default App;

function Statistics({ goodNum: good, badNum: bad, neutralNum: neutral }) {
  const all = good + neutral + bad;
  const average = 3 / all;
  const positive = (good / all) * 100;

  if (all === 0) {
    return <p>No feedback given</p>;
  }
  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={`${positive}%`} />
        </tbody>
      </table>
    </div>
  );
}

function Button({ onClick, text }) {
  return <button onClick={onClick}>{text}</button>;
}

function StatisticLine({ text, value }) {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
}
