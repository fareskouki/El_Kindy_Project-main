import React, { useEffect, useRef, useState } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Coversation/Conversation";
import LogoSearch from "../../components/LogoSearch/LogoSearch";
import BigChatBox from "../../components/BigChatBox/BigChatBox";
import NavIcons from "../../components/NavIcons/NavIcons";
import "./Chat.css";
import { userChats } from "../../api/ChatRequests";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import NavBar from "components/NavBar";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode library
import useAxiosPrivate from "hooks/useAxiosPrivate";

const Chat = () => {
  const dispatch = useDispatch();
  const socket = useRef();
  const accessToken = useSelector((state) => state.accessToken);
  const userId = accessToken ? jwtDecode(accessToken).id : "";
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [filteredChats , setFilteredChats] = useState([]);
  const [thereciver, setreciiiiver] = useState(null);

  const axiosPrivate = useAxiosPrivate();


  // Get the chat in chat section
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(userId, axiosPrivate);
        setChats(data);
        setFilteredChats(data); // Initialize filtered chats with all chats
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [userId]);

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io("ws://localhost:8800");
    socket.current.emit("new-user-add", userId);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, []);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage!==null) {
      socket.current.emit("send-message", sendMessage);}
  }, [sendMessage]);

  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      setReceivedMessage(data);
    });
  }, []);

  // Handle search operation
  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === "") {
      setFilteredChats(chats); // If search term is empty, show all chats
    } else {
      const filtered = chats.filter((chat) =>
        chat.name && chat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  };
  

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== userId);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  return (
    <>
      <NavBar />
      <div className="Chat">
        {/* Left Side */}
        <div className="Left-side-chat  p-3">
          <div className="Chat-container22">
            <div style={{ display: "flex", alignItems: "center" }}>
              <h4>Chats </h4>
              <LogoSearch onSearch={handleSearch} />
            </div>
            <div className="Chat-list" style={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}>
              {filteredChats.map((chat) => (
                <div key={chat._id} onClick={() => setCurrentChat(chat)}>
                  <Conversation
                    key={chat._id}
                    data={chat}
                    currentUser={userId}
                    online={checkOnlineStatus(chat)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="Right-side-chat "style={{ marginRight: "10px" }}>
          <div style={{ width: "20rem", alignSelf: "flex-end" }}></div>
          <BigChatBox
            chat={currentChat}
            currentUser={userId}
            setSendMessage={setSendMessage}
            receivedMessage={receivedMessage}
            thereciver={thereciver}
          />
        </div>
      </div>
    </>
  );
};

export default Chat;