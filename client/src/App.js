import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';
import Chat from './Chat';

const socket = io.connect('http://localhost:3001');

function App() {
  const [username, setUsername] = useState(''); //initialize the username state with an empty string ''
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    //handles the logic for joining a chat room
    if (username !== '' && room !== '') {
      //username and room should not be an empty string then run the code below:
      socket.emit('join_room', room); //room is the data payload of the event indicating that the user wants to join the specified chat room.
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? ( //conditional operator that checks the value of the showChat state
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Name..."
            onChange={(event) => {
              setUsername(event.target.value);
            }} // input element allows the user to enter their username. It uses the setUsername state updater function to update the username state whenever the input value changes.
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }} //input element allows the user to enter the chat room ID. Uses the setRoom state updater function to update the room state whenever the input value changes.
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div> //triggers the joinRoom function when clicked.
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div> //If showChat is true, this JSX code renders the Chat component, passing the socket, username, and room as props to the Chat component.
  );
}

export default App;
