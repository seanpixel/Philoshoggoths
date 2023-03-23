import React, { useState } from 'react';
import './App.css';

function App() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [topic, setTopic] = useState('');
  const [conversation, setConversation] = useState('');
  const [currentSpeaker, setCurrentSpeaker] = useState('');

  const handleName1Change = (e) => {
    setName1(e.target.value);
  };

  const handleName2Change = (e) => {
    setName2(e.target.value);
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const startConversation = async () => {
    const response = await fetch('/api/start-conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ start_prompt: topic, name1, name2 }),
    });
  
    const data = await response.json();
    setConversation(data.conversation);
    setCurrentSpeaker(name2);
  };

  const generateNextReply = async () => {
    const response = await fetch('/api/generate-response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation, responder: currentSpeaker }),
    });
  
    const data = await response.json();
    setConversation((prevConversation) => `${prevConversation}\n\n${currentSpeaker}: ${data.content}`);
    setCurrentSpeaker((prevSpeaker) => (prevSpeaker === name1 ? name2 : name1));
  };

  return (
    <div className="App">
      <h1>Philoshoggoths</h1>
      <div className="input-container">
        <input
          type="text"
          value={name1}
          onChange={handleName1Change}
          placeholder="Enter name for GPT-1"
        />
        <input
          type="text"
          value={name2}
          onChange={handleName2Change}
          placeholder="Enter name for GPT-2"
        />
      </div>
      <div className="input-container">
        <input
          type="text"
          value={topic}
          onChange={handleTopicChange}
          placeholder="Enter topic"
        />
        <button onClick={startConversation}>Start Conversation</button>
      </div>
      <div className="conversation-container">
        <textarea readOnly value={conversation} />
      </div>
      <button onClick={generateNextReply}>Next Reply</button>
    </div>
  );
}

export default App;
