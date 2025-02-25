import ChatBotIcon from "./components/ChatBotIcon"
import ChatForm from "./components/ChatForm"
import ChatMessage from "./components/ChatMessage"
import { useEffect, useState, useRef } from "react";

const App = () => {

  const [chatHistory , setChatHistory] = useState([]);
  const [showChatBot, setShowChatBot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotresponse = async (history) => {

    const updateChatHistory = (text) => {
      setChatHistory(history => [...history.filter(msg => msg.text !== "Thinking..."), {role: "model", text: text}]);
    }
    //formatting history based on the API
    history = history.map(({role,text}) => ({role, parts: [{text}]}))

    const requestOptions = {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body:JSON.stringify({contents : history})
    }

    try{
      const response  = await fetch(import.meta.env.VITE_API_URL, requestOptions)
      const data = await response.json();
      if(!response.ok) throw new Error(data.error.message || "Something is not working");
    
      console.log(data);
      const apiresponseText = data.candidates[0].content.parts[0].text.trim();
      updateChatHistory(apiresponseText);
    }catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior:"smooth"});
  }, [chatHistory]);

  return (
    <div className= {`container ${showChatBot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatBot(prev => !prev) } id="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>
      
      <div className="chatbot-popup">
        {/* Chat-bot Header */}
        <div className="chatbot-header">
          <div className="header-info">
            <ChatBotIcon></ChatBotIcon>
            <h2 className="logo-text">CHATBOT</h2>
          </div>
          <button onClick={() => setShowChatBot(prev => !prev) }
          className="material-symbols-rounded">keyboard_arrow_down</button>
        </div>
        {/* Chat-bot Body */}
        <div ref={chatBodyRef} className="chatbot-body">
          <div className="message bot-message">
            <ChatBotIcon/>
            <p className="message-text">
              Hey! <br/>How can I Help you today
            </p>
          </div>
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat}/>
          ))}
        
        </div>
        {/* Chat-bot Footer */}
        <div className="chatbot-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory= {setChatHistory}  generateBotresponse={generateBotresponse}/>
        </div>
      </div>
    
    </div>
  )
}

export default App
