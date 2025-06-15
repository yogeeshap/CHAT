import React, { useEffect, useRef, useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const [input, setInput] = useState("");
  const WS_BASE_URL = process.env.REACT_APP_WS_API_URL;
  console.log(WS_BASE_URL,'WS_BASE_URL')

  useEffect(() => {
    socketRef.current = new WebSocket(WS_BASE_URL);

    socketRef.current.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (input && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(input);
      setInput("");
    }
  };

  return (
    <div>
      <h1>WebSocket Chat</h1>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <input 
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
