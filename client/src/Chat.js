import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom'; //automatically scrolls to the bottom whenever new content is added to it

function Chat({ socket, username, room }) {
  //takes 3 parameters as props
  const [currentMessage, setCurrentMessage] = useState(''); //hook provided by React to initialize the state with an empty string ''
  const [messageList, setMessageList] = useState([]); //used to hold the text of the currently typed or submitted message in the chat.

  const sendMessage = async () => {
    if (currentMessage !== '') {
      //checks if the currentMessage state is not empty. It ensures that an empty message is not sent.
      const messageData = {
        //holds an object representing the data of the message to be sent. Contains 4 properties:
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit('send_message', messageData); //this event is sent to the server, which may then distribute the message to other participants in the same room.
      setMessageList((list) => [...list, messageData]); //updates the messageList state using the setMessageList state updater function.
      setCurrentMessage(''); //sets the currentMessage state to an empty string, effectively clearing the input field after the message has been sent.
    }
  };

  useEffect(() => {
    //a hook that sets up an event listener on the socket object to listen for 'receive_message' events from the server.
    socket.on('receive_message', (data) => {
      //listens to the receive message
      setMessageList((list) => [...list, data]); //a callback function that gets executed when the 'receive_message' event occurs.
    });
  }, [socket]);

  return (
    //represents the structure and layout of the chat component, divided into three main sections: header, body, and footer.
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            //maps over the messageList array, which contains chat message objects, and renders each message using JSX
            return (
              <div
                className="message"
                id={username === messageContent.author ? 'you' : 'other'} //if the message is from the same user as the logged-in user, it receives the id "you," and if it's from another user, it receives the id "other."
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>{' '}
                    {/* displays the content of each message using a paragraph (<p>) element and another div for the time and author/sender */}
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        {' '}
        {/* contains an input field where the user can type a message */}
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === 'Enter' && sendMessage();
          }}
        />{' '}
        {/* When the user presses the Enter key, this function is called, and it checks if the pressed key is 'Enter.' If it is, the sendMessage function  is called to send the message. */}
        <button onClick={sendMessage}>&#9658;</button>{' '}
        {/* calls the sendMessage function to send the message. */}
      </div>
    </div>
  );
}

export default Chat; //exports the Chat component
