import React, { useEffect, useState, useRef } from "react";
import { addMessage, getMessages } from "../../api/MessageRequests";
import "./ChatBox.css";
import { io } from "socket.io-client";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import useAxiosPrivate from "hooks/useAxiosPrivate";

const ChatBox = (props) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [picturePath, setPicturePath] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const socket = useRef();

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

const sendMessageToServer = () => {
  const message = {
    receiverId: props.receiverId,
    chatId: props.keyy, // Assurez-vous d'utiliser la prop correcte pour chatId
    senderId: userId,
    text: newMessage,
  };

  setSendMessage(message);
};

  

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

  const getUserData = async () => {
    try {
      const { data } = await axiosPrivate.get(`/auth/${props.receiverId}`);
      setUserData(data);
    } catch (error) {
      console.log(error);
    }
  };

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
      return;
    }
    
    const imagePath = picturePath ? URL.createObjectURL(picturePath) : null;
    
    const formData = new FormData();
    formData.append("chatId", props.keyy);
    formData.append("senderId", props.currentUser);
    formData.append("text", newMessage);
    formData.append("picturePath", imagePath);
    
    try {
      const { data } = await addMessage(formData, axiosPrivate);
      setMessages([...messages, data]);
      setNewMessage("");
      setPicturePath(null);
      setSendMessage(data); // Ajoutez cette ligne pour définir le message à envoyer
    } catch (error) {
      console.log(error);
    }
    sendMessageToServer();
      // Envoyer le message au serveur
      socket.current.emit("send-message", messages);
      setNewMessage(""); // Réinitialiser le champ de texte après l'envoi
    
  };

  //console.log("props",props.keyy);


  // Add the received message to the messages array and update the state
  useEffect(() => {
    if (socket.current) {
      socket.current.on("receive-message", (receivedMessage) => {
        // Vérifiez si le message reçu n'est pas déjà présent dans l'état
        const isMessageAlreadyAdded = messages.find(message => message._id === receivedMessage._id);
        if (!isMessageAlreadyAdded) {
          setMessages(prevMessages => [...prevMessages, receivedMessage]);
        }
      });
  
      return () => {
        if (socket.current) {
          socket.current.off("receive-message");
        }
      };
    }
  }, [props.keyy, messages]);
  
  

  const scroll = useRef();
  const imageRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPicturePath(file);
  };
 // Connect to Socket.io
 useEffect(() => {
  socket.current = io("ws://localhost:8800");
  //console.log("Connected to socket server");
  socket.current.emit("new-user-add", userId);

  socket.current.on("get-users", (users) => {
    //console.log("Online Users:", users);
    setOnlineUsers(users);
  });
}, []);


// Send Message to socket server
useEffect(() => {
 // console.log("Socket current state:", socket.current);
  if (sendMessage !== null && socket.current) {
 //   console.log("Sending message:", sendMessage);
    socket.current.emit("send-message", sendMessage);
  }
}, [sendMessage]);

// Get the message from socket server
useEffect(() => {
  if (socket.current) {
    socket.current.on("receive-message", (message) => {
 //     console.log("Message reçu:", message);
      if (message.chatId === props.keyy) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    });

    return () => {
      if (socket.current) {
        socket.current.off("receive-message");
      }
    };
  }
}, [props.keyy]);
//console.log("Messages actuels dans l'état:", messages);

  return (
    <>
      {isChatBoxOpen && (
        <div>
          <div className="chat-header  sticky-header " style={{ padding: "0.8rem", borderBottom: "1px solid #ccc" }} >
            <div
              className="follower"
              style={{ display: "flex", alignItems: "center" }}
            >
              <img
                src={userData?.picturePath || "defaultProfile.png"}
                alt="Profile"
                className="followerImage"
                style={{ width: "35px", height: "35px", borderRadius: "50%" }}
              />
              <div className="name " style={{ fontSize: "1rem", fontFamily: "sans-serif", color: 'black', marginLeft: "10px" }}>
                <span>
                  {userData?.firstName} {userData?.lastName}
                </span>
              </div>
              <div
                className="close-button"
                onClick={handleClose}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  color: "black",
                }}
              >
                x
              </div>
            </div>
          </div>
          <div className="ChatBox-container">
            {props.chat ? (
              <>
                <div className="chat-body my-5">
                  {messages && messages.length > 0 ? (
                    messages.map((message) => (
                      
                      <div
                        key={message._id}
                        className={`message ${message.senderId === props.currentUser
                          ? "own"
                          : "received"
                          }`}
                      >
                        <span>{message.text}</span>
                      {message.picturePath && !message.text && (
  <div className="image-container">
    {/* Assurez-vous que message.picturePath contient l'URL complète accessible */}
    <img src={message.picturePath} alt="Uploaded" style={{ width: "200px", height: "100px" }} />
    <span className="message-time">{format(message.createdAt)}</span>
  </div>
)}
                        {!message.picturePath && (
                          <span className="message-time">{format(message.createdAt)}</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="style-de-non-message">No messages yet...</span>
                  )}
                  <div ref={scroll}></div>
                </div>
              </>
            ) : (
              <span className="chatbox-empty-message">
                Appuyez sur une conversation pour commencer...
              </span>
            )}
          </div>

          <div className="chat-sender input-fixed " style={{ padding: "0.8rem", borderTop: "1px solid #ccc" }}>
            <div onClick={() => imageRef.current.click()}>+</div>
            <InputEmoji value={newMessage} onChange={handleChange} onKeyDown={handleKeyDown} />
            {picturePath && (
              <img src={URL.createObjectURL(picturePath)} alt="Selected" style={{ width: "40px", height: "40px" }} />
            )}
            <div className="send-button2" onClick={handleSend}>
              <i className="bi bi-send"></i>
            </div>
            <input
              type="file"
              style={{ display: "none" }}
              ref={imageRef}
              onChange={handleImageChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
