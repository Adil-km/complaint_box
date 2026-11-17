import { Bot, X, SendHorizontal} from 'lucide-react';
import { useRef, useState } from 'react';

function ChatBotBox() {
  const [messages, setMessages] = useState([
    { id: 'welcome', message: 'Hi! How can I help you today?', role: 'bot' }
  ]);
  const [input, setInput] = useState("")
  const inputRef = useRef(null)
  const [showChat, setShowChat] = useState(false)

  function addMessage(text, role){   
    if (!text.trim()) return;

    const data = { 
      id: crypto.randomUUID(), 
      message: text, 
      role 
    };
    setMessages(prevMessages => [...prevMessages, data])
    setInput("")
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      addMessage(input, "user");
    }
  }

  const lastMessageRef = (node) => {
    if (node) {
      node.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* chat bubble */}

      {showChat ?
        (
        <section className='fixed z-50 flex flex-col overflow-hidden bg-white shadow-2xl border border-slate-200 bottom-20 right-4 w-[calc(100vw-2rem)] h-[60vh] max-h-[500px] rounded-2xl sm:bottom-24 sm:right-6 sm:w-96 sm:h-[550px]'>
          <header className=' bg-blue-600 flex flex-row items-center px-4 drop-shadow-md'>

            <div className='w-full h-15 flex flex-row gap-2 justify-start items-center'>
              <span className='bg-white w-fit h-fit p-2 rounded-full'>
                <Bot color='#155dfc'/>
              </span>
              <span className='text-white'>AI Assistant</span>
            </div>

            <button 
              onClick={()=> setShowChat(false)}
              className='hover:bg-white/20 p-2 w-fit h-fit rounded-full'>
                <X color='white' size={18}/>
            </button>
          </header>


          <main className='flex flex-col w-full h-full bg-gray-100 gap-4 p-4 overflow-scroll scrollbar-none'>

          {messages &&
            messages?.map((chat)=>(
              <ChatMessage key={chat.id} content={chat.message} role={chat.role}/>
              )
            )
          }
          
          <div ref={lastMessageRef} />

          </main>
          
          <div className='flex flex-row justify-center items-center w-full h-20 bg-white gap-2 px-3 py-4 drop-shadow-md'>

            <input type="text" 
              value={input}
              ref={inputRef}
              onChange={(e)=> setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Ask anything...'
              className='bg-gray-50 align-middle outline-blue-600 border-gray-200 border rounded-full h-10 w-full px-4'/>

            <button
              onClick={()=>addMessage(input, "user")}
              disabled={!input} 
              className='bg-blue-600 rounded-full p-2 focus:outline-black'>
              <SendHorizontal size={16} color="white" />
            </button>

          </div>
        </section>)
      :
        (<button onClick={()=> setShowChat(true)} className=" bg-blue-700 rounded-full justify-center items-center p-3 fixed z-50 flex flex-col overflow-hidden shadow-2xl  bottom-20 right-4 w-fit h-fit cursor-pointer">
          <Bot color='white' size={35} />
        </button>)
      }
    </>
  )
}

function ChatMessage({content, role="user"}){
  return role === "user"?
      (
        <div className='flex flex-col items-end'>
          <div className='bg-blue-600 text-white drop-shadow-sm p-3 rounded-l-2xl rounded-tr-2xl max-w-4/5'>
            <span className=''>{content}</span>
          </div>
        </div>
      ):
      (
        <div className='flex flex-col items-start'>
          <div className='bg-white text-black drop-shadow-sm p-3 rounded-r-2xl rounded-tl-2xl max-w-4/5'>
            <span className=''>{content}</span>
          </div>
        </div>
      )
  
}

export default ChatBotBox