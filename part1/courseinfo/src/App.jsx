function App() {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
}

function Header({ course }) {
  return <h1>{course}</h1>;
}

function Content({ parts }) {
  return (
    <div>
      {parts.map((part) => {
        return (
          <Part
            key={part.name}
            name={part.name}
            numOfExercises={part.exercises}
          />
        );
      })}
    </div>
  );
}

function Total({ parts }) {
  const totalNumOfExercises = parts.reduce(
    (acc, cur) => acc + cur.exercises,
    0,
  );
  return <p>Number of exercises {totalNumOfExercises}</p>;
}

function Part({ name, numOfExercises }) {
  return (
    <p>
      {name} {numOfExercises}
    </p>
  );
}

export default App;
