import { useEffect, useState } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import personService from "./services/persons";

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

  function resetAllForm() {
    setNewName("");
    setNewNumber("");
  }

  useEffect(() => {
    personService.getAll().then((initialData) => {
      setPersons(initialData);
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const newPerson = { name: newName, number: newNumber };
    const existingPerson = persons.find((p) => p.name === newName);

    if (existingPerson) {
      const shouldUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with the new one?`,
      );
      if (!shouldUpdate) return resetAllForm();

      personService
        .update(existingPerson.id, newPerson)
        .then((returnedPerson) => {
          setPersons(
            persons.map((person) =>
              person.id === returnedPerson.id ? returnedPerson : person,
            ),
          );
        });
    } else {
      personService.create(newPerson).then((returnedPerson) => {
        setPersons([...persons, returnedPerson]);
      });
    }

    resetAllForm();
  }

  function handleDeletePerson(id) {
    const deletePerson = persons.find((p) => p.id === id);
    if (!window.confirm(`Delete ${deletePerson.name}`)) return;

    personService.deletePerson(id).then((deletedPerson) => {
      const newPersons = persons.filter((p) => p.id !== deletedPerson.id);
      setPersons(newPersons);
    });
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        value={filterInput}
        onChange={(e) => setFilterInput(e.target.value)}
      />
      <h3>add a new</h3>
      <PersonForm
        onSubmit={handleSubmit}
        nameVal={newName}
        onChangeName={(e) => setNewName(e.target.value)}
        numberVal={newNumber}
        onChangeNumber={(e) => setNewNumber(e.target.value)}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} onDelete={handleDeletePerson} />
    </div>
  );
}

export default App;
