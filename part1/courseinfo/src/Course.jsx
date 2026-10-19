function Course({ course }) {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
}

function Header({ course }) {
  return <h2>{course}</h2>;
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
  return <b>Total of {totalNumOfExercises} exercises</b>;
}

function Part({ name, numOfExercises }) {
  return (
    <p>
      {name} {numOfExercises}
    </p>
  );
}

export default Course;
