import React from "react";

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
    if (message.trim().length === 0) {
      messageSetter("Please enter a valid message.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    const realAPI_URL = "https://license-management-server.vercel.app/api";
    const API_URL = process.env.API_URL || realAPI_URL;

    try {
      messageSetter(<Loader />);

      const response = await fetch(`${API_URL}/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: message }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const chatbotResponse = await response.json();
      const reply = chatbotResponse.answer || "No response from AI";

      const botMessage = createChatBotMessage(reply);
      setState((prev) => {
        const updatedMessages = [...prev.messages];
        updatedMessages.pop();
        updatedMessages.push(botMessage);
        return { messages: updatedMessages };
      });
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data?.message || error.message
        : "Sorry, there was an error while fetching the response.";

      const botMessage = createChatBotMessage(errorMessage);
      setState((prev) => {
        const updatedMessages = [...prev.messages];
        updatedMessages.pop();
        updatedMessages.push(botMessage);
        return { messages: updatedMessages };
      });
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
