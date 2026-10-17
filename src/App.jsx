import { useEffect, useRef } from "react";
import Composer from "./components/Composer.jsx";
import Header from "./components/Header.jsx";
import Message from "./components/Message.jsx";
import Welcome from "./components/Welcome.jsx";
import { useChat } from "./hooks/useChat.js";
import { useHealth } from "./hooks/useHealth.js";

export default function App() {
  const { messages, busy, send, reset } = useChat();
  const health = useHealth();
  const scroller = useRef(null);

  useEffect(() => {                                   // follow the stream to the bottom
    scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages]);

  return (
    <div className="app">
      <Header health={health} onNewChat={reset} disabled={busy} />
      <main className="scroll" ref={scroller} aria-live="polite">
        <div className="messages">
          {messages.length === 0 ? <Welcome onPick={send} /> : messages.map((m) => <Message key={m.id} m={m} />)}
        </div>
      </main>
      <Composer onSend={send} busy={busy} />
    </div>
  );
}
