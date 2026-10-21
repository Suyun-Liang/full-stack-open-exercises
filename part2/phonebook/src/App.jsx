import { useEffect, useState } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import axios from "axios";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterInput, setFilterInput] = useState("");
  const filteredPersons = persons.reduce((result, cur) => {
    const word = filterInput.toLowerCase();
    const nameWithoutSpace = cur.name.replaceAll(/\s/g, "").toLowerCase();
    if (nameWithoutSpace.includes(word)) result.push(cur);
    return result;
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((res) => {
      setPersons(res.data);
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (isNameExist(newName, persons)) {
      window.alert(`${newName} is already added to phonebook`);
    } else {
      setPersons([...persons, { name: newName, number: newNumber }]);
    }
    setNewName("");
    setNewNumber("");
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        value={filterInput}
        onChange={(e) => setFilterInput(e.target.value)}
      />
      <h2>add a new</h2>
      <PersonForm
        onSubmit={handleSubmit}
        nameVal={newName}
        onChangeName={(e) => setNewName(e.target.value)}
        numberVal={newNumber}
        onChangeNumber={(e) => setNewNumber(e.target.value)}
      />
      {/* <div>debug: {newName}</div>
      <div>debug: {newNumber}</div>
      <div>debug: {filterInput}</div> */}
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} />
    </div>
  );
}

export default App;

function isNameExist(name, arr) {
  let result = false;
  arr.forEach((e) => {
    if (e.name === name) {
      result = true;
      return;
    }
  });
  return result;
}
