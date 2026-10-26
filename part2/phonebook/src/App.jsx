import { useEffect, useState } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import personService from "./services/persons";
import Notification from "./Notification";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterInput, setFilterInput] = useState("");
  // {type: "error"|"success", text:""}
  const [notification, setNotification] = useState(null);
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

  useEffect(() => {
    if (!notification?.text) return;
    window.setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, [notification?.text]);

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
          setNotification({
            type: "success",
            text: `Changed ${returnedPerson.name}'s number`,
          });
        })
        .catch((error) => {
          console.log(error.response.data.error);
          setNotification({ type: "error", text: error.response.data.error });
        });
    } else {
      personService
        .create(newPerson)
        .then((returnedPerson) => {
          setPersons([...persons, returnedPerson]);
          setNotification({
            type: "success",
            text: `Added ${returnedPerson.name}`,
          });
        })
        .catch((error) => {
          console.log(error.response.data.error);
          setNotification({ type: "error", text: error.response.data.error });
        });
    }

    resetAllForm();
  }

  function handleDeletePerson(id) {
    const deletePerson = persons.find((p) => p.id === id);
    if (!window.confirm(`Delete ${deletePerson.name}`)) return;

    personService
      .deletePerson(id)
      .then(() => {
        const newPersons = persons.filter((p) => p.id !== deletePerson.id);
        setPersons(newPersons);
      })
      .catch((err) => {
        if (err.status === 404) {
          setNotification({
            type: "error",
            text: `Information of ${deletePerson.name} has already been removed from the server`,
          });
        }
      });
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
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
