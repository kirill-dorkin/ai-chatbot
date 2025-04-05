import { useEffect, useRef, useState } from "react"
import ChatbotIcon from "./components/ChatbotIcon"
import ChatForm from "./components/ChatForm"
import ChatMessage from "./components/ChatMessage"

const App = () => {
  const [chatHistory, setChatHistory] = useState([])
  const [showChatbot, setShowChatbot] = useState(false)
  const chatBodyRef = useRef()

  const generateBotResponse = async (history) => {
    const formattedMessages = history.map(({ role, text }) => ({
      role: role === "model" ? "assistant" : role,
      content: text
    }))

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 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"
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: formattedMessages,
          temperature: 0.7
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error?.message || "Groq API error")

      const botReply = data.choices?.[0]?.message?.content || "Извини, я не смог ответить."

      setChatHistory((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: "model", text: botReply }
        return updated
      })
    } catch (err) {
      console.error("Groq error:", err)
      setChatHistory((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: "model", text: "⚠️ Ошибка при запросе к Groq API." }
        return updated
      })
    }
  }

  useEffect(() => {
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavor: "smooth" })
  }, [chatHistory])

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatbot(prev => !prev)} id="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>

      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">
              ChatBot
            </h2>
          </div>

          <button onClick={() => setShowChatbot(prev => !prev)} className="material-symbols-rounded">
            keyboard_arrow_down
          </button>
        </div>

        <div className="chat-body" ref={chatBodyRef}>
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there 👋 <br /> How can I help you today?
            </p>
          </div>

          {
            chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))
          }
        </div>

        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  )
}

export default App
