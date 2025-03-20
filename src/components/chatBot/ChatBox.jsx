import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import config from './config.jsx';
import MessageParser from './MessageParser.jsx';
import ActionProvider from './ActionProvider.jsx';
import Image from "next/image";
import AssistantIcon from "../../assets/icons/assistantIcon.svg";
import { useState } from 'react';

const ChatBox = () => {
  const [isChatBotVisible, setIsChatBotVisible] = useState(false);

  const toggleChatBot = () => {
    setIsChatBotVisible(!isChatBotVisible);
  };

  return (
    <>
      <div
        className={`${
          isChatBotVisible ? "block" : "hidden"
        } fixed bottom-[12vh] right-[6vw] border border-gray-300 shadow-lg rounded-lg z-99999 bg-white`}
      >
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
          placeholderText="Tell me what do you need?"
        />
      </div>
      <div className="fixed bottom-[20px] right-[6vw] z-50 max-lg:bottom-[4vh] max-lg:right-[7vh]">
        <span
          onClick={toggleChatBot}
           className=' rounded-[6px] box-border shadow-[#1f0f0f69] shadow-md hover:cursor-pointer '
        >
          <Image src={AssistantIcon} alt="assistant icon" width={50} height={50} />
        </span>
      </div>
    </>
  );
};

export default ChatBox;
