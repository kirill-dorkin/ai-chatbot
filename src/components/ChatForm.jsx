import { useRef } from 'react'

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse, isLoading }) => {
  const inputRef = useRef()

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (isLoading) return // Prevent multiple submits

    const userMessage = inputRef.current.value.trim()
    if (!userMessage) return
    inputRef.current.value = ""

    const updatedHistory = [...chatHistory, { role: "user", text: userMessage }]
    setChatHistory([
      ...updatedHistory,
      { role: "model", text: "Thinking..." }
    ])
    generateBotResponse(updatedHistory)
  }

  return (
    <form className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder={isLoading ? "Please wait..." : "Message..."}
        className="message-input"
        required
        disabled={isLoading}
      />
      <button
        className="material-symbols-rounded"
        type="submit"
        disabled={isLoading}
        title={isLoading ? "Wait for response" : "Send message"}
        style={{
          opacity: isLoading ? 0.4 : 1,
          cursor: isLoading ? "not-allowed" : "pointer"
        }}
      >
        arrow_upward
      </button>
    </form>
  )
}

export default ChatForm
