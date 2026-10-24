# Phonebook Backend

This project is part of the [Full Stack Open](https://fullstackopen.com/en/) course, Part 3.

It is a full-stack phonebook application built with React, Node.js, and Express. The backend serves the production build of the frontend.

## Live Application

**[View the deployed Phonebook App](https://full-stack-open-exercises-c13v.onrender.com)**

## Technologies

- React
- Vite
- Node.js
- Express
- Axios
- Render

## API Endpoints

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| GET    | `/api/persons`     | Get all persons    |
| GET    | `/api/persons/:id` | Get a person by ID |
| POST   | `/api/persons`     | Add a new person   |
| DELETE | `/api/persons/:id` | Delete a person    |

## Deployment

The application is deployed on Render. Express serves both the REST API and the frontend production build from the `dist` directory.
