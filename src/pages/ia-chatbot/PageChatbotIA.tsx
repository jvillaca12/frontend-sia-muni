import { ReactElement } from 'react';
import Chatbot from './../../data/services/ChatbotIAService';

const ChatBotPage = (): ReactElement => {
  return (
    <>
      <div>
        <h1>Chatbot SIA MPP</h1>
        <Chatbot />
      </div>
    </>
  );
};

export default ChatBotPage;
