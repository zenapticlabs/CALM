import { createChatBotMessage } from 'react-chatbot-kit';
import ActiveIcon from "../../assets/icons/active.svg";
import AssistantIcon from "../../assets/icons/avatar.svg";
import SubmitIcon from "../../assets/icons/submitIcon.svg"
import Image from "next/image";
import Bolt from "../../assets/icons/bolt.svg";

const config = {
  
  initialMessages: [createChatBotMessage(`Hey there! I'm Jarvis, your AI assistant. How can I help you today?`), 
  ],
  
  customStyles: {
    userMessageBox:{
      backgroundColor: '#fffff',
    },
  },  
  customComponents: {
    botAvatar: () =>  <Image src={Bolt} alt="Bolt Icon" height={32} width={32} /> ,
    submitButton: () => <button className="bg-[#0052CC] text-white rounded-full p-2" ><Image src={SubmitIcon} alt="Submit Icon" width={20} height={20} /></button>,
   header: () =>  <div className="flex justify-center items-center">
   <div className=" flex justify-start items-center mb-6 border-b-[1px] border-[#E3E5E5] pb-4 pt-3  w-[90%]">
     <div className="flex items-center justify-start gap-2">
       <Image
         src={AssistantIcon}
         alt="Assistant Icon"
         className="w-10 h-10"
         width={56}
         height={56}
       />
     </div>
     <div className="  flex flex-col justify-start items-start pl-[10px]">
       <div >
         <p className="flex items-center gap-2">
           <span className=" font-abel font-normal text-[17.5px] leading-[100%] tracking-[0%] align-middle">AI Assistant</span>
         </p>
       </div>
       <div className="flex justify-start items-center font-abel font-normal text-sm leading-none tracking-normal align-middle">
         <Image
           src={ActiveIcon}
           alt="Active Icon"
           width={8}
           height={8}
           className='mr-[5px]'
         />
         Always active
       </div>
     </div>
   </div>
   </div>

   
  }
};

export default config;