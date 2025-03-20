import React, { useState } from 'react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const Loader = () => (
    <div className="loader" id="loader">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );


  const messageSetter = (reply) => {
    const botMessage = createChatBotMessage(reply);
    setState((prev) => ({
      messages: [...prev.messages, botMessage],
    }));
  };

  const callGPT = async (message) => {
    messageSetter(<Loader />);
    try {
      // will replace it it with actual API call.
      const reply="Thank you for your message. I will get back to you soon.";
      const botMessage = createChatBotMessage(reply);
      setState((prev) => {
        const updatedMessages = [...prev.messages];
        updatedMessages.pop();
        updatedMessages.push(botMessage);
        return { messages: updatedMessages };
      });
    } catch (error) {
      setLoading(false);
      messageSetter("Sorry, there was an error while fetching the response.");      
    }
  };

 
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            callGPT,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
