# exercise 0.6: New note in Single page app diagram

```mermaid
sequenceDiagram
    participant browser
    participant server

    browser ->> server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    Note right of browser:{content-type: application/json, payload: {content:"??", date:"2026-19-10"}, ...}
    server -->> browser: 201 Created
    Note left of server: {"message":"note created"}

```
