import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([{ role: "bot", text: "Hello! I can help you draft your proposal." }]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", text: input }, { role: "bot", text: "Thanks! I'll process your query soon." }]);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-bold mb-2">AI Assistant</h2>
      <div className="h-64 overflow-y-auto border p-2 rounded mb-2">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block px-2 py-1 rounded ${
                m.role === "user" ? "bg-blue-200" : "bg-gray-200"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="px-3 py-2 bg-blue-600 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
}
