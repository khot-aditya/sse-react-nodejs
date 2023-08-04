import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const source = new EventSource('http://localhost:4000/updates');

    source.addEventListener('connected', event => {
      const message = JSON.parse(event.data);
      setMessages([
        ...messages,
        { text: `Connected: ${message.welcomeMsg}`, date: null, id: 0 },
      ]);
    });

    source.addEventListener('update', event => {
      const message = JSON.parse(event.data);
      setMessages([
        ...messages,
        {
          text: message.value,
          date: message.date,
          id: messages.length + 1,
        },
      ]);
    });

    return () => {
      source.close();
    };
  }, [messages]);

  function renderMessages() {
    return messages.map(message => (
      <li className="App-message" key={message.id}>
        {message.text} | {message.date}
      </li>
    ));
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">SSE Server connected </h1>
      </header>
      <p className="App-intro">
        Receiving message from node server-sent events:
        {renderMessages()}
      </p>
    </div>
  );
}

export default App;