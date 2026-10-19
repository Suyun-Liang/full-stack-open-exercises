# exercise 0.4: New note diagram

```mermaid

sequenceDiagram
    participant browser
    participant server

    browser ->> server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    Note right of browser:{content-type: application/x-www-form-urlencoded, body: {content:"??", ...}, ...}
    server -->> browser: 302 Found (URL redirect)

    browser ->> server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    server -->> browser: HTML document

    browser ->> server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    server -->> browser: Css file

    browser ->> server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    server -->> browser: Javascript file

    browser ->> server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    server -->> browser: JSON data: [{ "content": "HTML is easy","date": "2019-05-23T17:30:31.098Z"}...]


```
