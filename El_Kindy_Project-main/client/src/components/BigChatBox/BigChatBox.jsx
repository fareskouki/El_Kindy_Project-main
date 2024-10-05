import React, { useEffect, useState, useRef } from "react";
import { addMessage, getMessages } from "../../api/MessageRequests";
import "./BigChatBox.css";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { io } from "socket.io-client";

const ChatBox = (props) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [picturePath, setPicturePath] = useState(null);
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatMember] = useState("");

  const accessToken = useSelector((state) => state.accessToken);
  const refreshTokenState = useSelector((state) => state.refreshToken);
  const userId = accessToken ? jwtDecode(accessToken).id : "";
  const dispatch = useDispatch();

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  const handleClose = () => {
    setIsChatBoxOpen(false);
    props.onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

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
    setMessages((prevMessages) => [...prevMessages, data]);
  });
}, []);


//fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(props.keyy, axiosPrivate);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (props.chat !== null) fetchMessages();
  }, [props.chat, accessToken, dispatch]);


  //getUserData
  const getUserData = async () => {
    try {
      const { data } = await axiosPrivate.get(`/auth/${props.thereciver}`);
      setUserData(data);
    } catch (error) {
      console.log(error);
    }
  };
 
useEffect(() => {
  if (receivedMessage && receivedMessage.chatId === props.keyy) {
    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    console.log("receivedMessage", receivedMessage);
  }
}, [receivedMessage]);

  //scroll 2 last msg
  useEffect(() => {
    if (props.chat !== null && userData === null) {
      getUserData();
    }
  }, [props.chat, userData]);

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    // Vérifier si le nouveau message n'est pas vide
    if (newMessage.trim() === "" && !picturePath) {
      return; // Ne rien faire si le message est vide et qu'aucune image n'est sélectionnée
    }

    // Utiliser le chemin de l'image directement
    const imagePath = picturePath ? URL.createObjectURL(picturePath) : null;

    const formData = new FormData();
    formData.append("chatId", props.keyy);
    formData.append("senderId", props.currentUser);
    formData.append("text", newMessage);
    formData.append("picturePath", imagePath); // Utiliser le chemin de l'image

    try {
      const { data } = await addMessage(formData, axiosPrivate);
      setMessages([...messages, data]);
      setNewMessage("");
      setPicturePath(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (receivedMessage && receivedMessage.chatId === props.keyy) {
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage]);


  const scroll = useRef();
  const imageRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPicturePath(file);
  };

  return (
    <div className="ChatBox-container-big">
      {props.chat ? (
        <>
          {/* chat-header */}
          <div className="chat-header-big">
            <div className="follower" style={{ display: "flex", alignItems: "center" }}>
              <img
                src={userData?.picturePath || "defaultProfile.png"}
                alt="Profile"
                className="followerImage"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
              <div className="name" style={{ fontSize: "0.9rem", marginLeft: "10px" }}>
                <span>
                  {userData?.firstName} {userData?.lastName}
                </span>
              </div>
            </div>
            <hr
              style={{
                width: "95%",
                border: "0.1px solid #ececec",
                marginTop: "20px",
              }}
            />
          </div>
          {/* chat-body */}
          <div className="chat-body-big">
            {messages && messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`message ${message.senderId === props.currentUser ? "own" : "received"}`}
                >
                  <span>{message.text}</span>
                  
                  {message.picturePath && !message.text && ( // Ajoutez cette condition
        <img src={message.picturePath} alt="Uploaded" />
      )}
                  <span>{format(message.createdAt)}</span>
                </div>
              ))
            ) : (
              <span>No messages yet...</span>
            )}
            <div ref={scroll}></div> {/* For scrolling to the bottom */}
          </div>
          {/* chat-sender */}
          <div className="chat-sender-big">
            <div onClick={() => imageRef.current.click()}>+</div>
            <InputEmoji
              value={newMessage}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            {picturePath && (
              <img
                src={URL.createObjectURL(picturePath)}
                alt="Selected"
                style={{ width: "50px", height: "50px" }} // Définissez la taille de l'image comme vous le souhaitez
              />
            )}
            <div className="send-button2-big" onClick={handleSend}>
              Send
            </div>
            <input
              type="file"
              style={{ display: "none" }}
              ref={imageRef}
              onChange={handleImageChange}
            />
          </div>

        </>
      ) : (
        <span className="chatbox-empty-message-big">Tap on a chat to start conversation...</span>
      )}
    </div>

  );
};

export default ChatBox;