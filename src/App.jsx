import { useEffect, useRef, useState } from "react"
import ChatbotIcon from "./components/ChatbotIcon"
import ChatForm from "./components/ChatForm"
import ChatMessage from "./components/ChatMessage"

const App = () => {
  const [chatHistory, setChatHistory] = useState([])
  const [showChatbot, setShowChatbot] = useState(false)
  const chatBodyRef = useRef()

  // Handles interaction with Groq API and appends response to chat history
  const [isLoading, setIsLoading] = useState(false)

  const generateBotResponse = async (history) => {
    setIsLoading(true)

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

      const botReply = data.choices?.[0]?.message?.content || "Sorry, I couldn't answer."

      setChatHistory(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: "model", text: botReply }
        return updated
      })
    } catch (err) {
      console.error("Groq error:", err)
      setChatHistory(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: "model", text: "⚠️ Failed to get response from Groq API." }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }


  // Scroll to bottom of chat when new message arrives
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth" // ✅ typo fixed: 'behavor' → 'behavior'
      })
    }
  }, [chatHistory])

  // Toggles chatbot visibility
  const toggleChatbot = () => setShowChatbot(prev => !prev)

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      {/* Floating button to toggle chatbot */}
      <button onClick={toggleChatbot} id="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>

      {/* Chatbot popup window */}
      <div className="chatbot-popup">
        {/* Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">ChatBot</h2>
          </div>

          <button
            onClick={toggleChatbot}
            className="material-symbols-rounded"
            aria-label="Minimize chatbot"
          >
            keyboard_arrow_down
          </button>
        </div>

        {/* Chat messages */}
        <div className="chat-body" ref={chatBodyRef}>
          {/* Initial bot greeting */}
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there 👋 <br /> How can I help you today?
            </p>
          </div>

          {/* Chat message history */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Chat input form */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default App
