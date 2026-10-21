import axios from "axios";

const BASE_URL = "http://localhost:3001/persons";
function getAll() {
  return axios.get(BASE_URL).then((res) => res.data);
}

function create(data) {
  return axios.post(BASE_URL, data).then((res) => res.data);
}

function deletePerson(id) {
  return axios.delete(`${BASE_URL}/${id}`).then((res) => res.data);
}

function update(id, data) {
  return axios.put(`${BASE_URL}/${id}`, data).then((res) => res.data);
}

export default { getAll, create, deletePerson, update };
