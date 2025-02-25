import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotresponse}) => {

    const inputRef = useRef();

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if(!userMessage) return;
        inputRef.current.value = ""

        setChatHistory((history) => [...history, {role: "user", text: userMessage}])
        setTimeout(() => {
          setChatHistory((history) => [...history, {role: "model", text: "Thinking..."}]);
          generateBotresponse([...chatHistory, {role: "user", text: userMessage}])
        },500)
    }

  return (
    <div>
      <form action="#" className="chatbot-form" onSubmit={onSubmitHandler}>
            <input ref={inputRef} type="text" placeholder="Message..." className="message-input" required/>
            <button className="material-symbols-rounded">arrow_upward</button>
          </form>
    </div>
  )
}

export default ChatForm
