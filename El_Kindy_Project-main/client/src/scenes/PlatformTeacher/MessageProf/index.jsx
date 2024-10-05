import React, { useEffect, useState, useRef } from 'react';
import NavBar from "components/NavBar";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import SideBarTeacher from 'components/SideBarTeacher';
import TopBarTeacherTeacher from 'components/TopBarTeacherStudent';
import ChatBox from "../../../components/ChatBox/ChatBox";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { createChat, findChat } from '../../../api/ChatRequests';
import Footer from 'components/Footer';
function Index() {
  const accessToken = useSelector((state) => state.accessToken);
  const refreshTokenState = useSelector((state) => state.refreshToken);
  const [users, setUsers] = useState([]);
  const [existingChat, setExistingChat] = useState([]);
  const [showChatBox, setShowChatBox] = useState(false);
  const [createdChatId, setCreatedChatId] = useState(null);
  const [reciveeeeeerId, setReciveeeeeerId] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const socket = useRef();
const [receiverData, setReceiverData] = useState(null);

  const userId = accessToken ? jwtDecode(accessToken).id : "";
 //the other user of the chat
  const [receiverId, setReceiverId] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get(`/chat/getChats/${userId}`, {
          signal: controller.signal
        });
        setUsers(response.data);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
        }
      }
    }

    getUsers();
    return () => {
      controller.abort();
    }
  }, [accessToken, dispatch]);

  // Dans votre composant Index
 
  useEffect(() => {
    if (createdChatId) {
      setShowChatBox(true);
    }
  }, [createdChatId]);


  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axiosPrivate.get(`/chat/getChats/${userId}`);
        setUsers(response.data); // Supposons que chaque objet de chat inclut maintenant `otherUser`
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchChats();
  }, [userId, axiosPrivate]);
  
    // Dans votre composant Index
    const handleContact = async (id) => {
      try {
        const response = await axiosPrivate.get(`/chat/find/${userId}/${id}`);
    
        if (response.status === 200 && response.data) {
          setCreatedChatId(response.data._id);
          const otherUserId = response.data.members.find(member => member !== userId);
          setReciveeeeeerId(otherUserId); // Id de l'autre membre du chat
          setReceiverId(otherUserId); // Mise à jour pour déclencher la récupération des données de l'utilisateur
        } else {
          alert("Une erreur s'est produite lors de la recherche du chat.");
          return;
        }
      } catch (error) {
        console.error("Erreur lors de la recherche ou de la création du chat :", error);
        alert("Une erreur s'est produite lors de la recherche du chat.");
        return;
      }
    };
    



  return (
    <div>
      <NavBar />
      <TopBarTeacherTeacher />
      <section className="pt-0">
        <div className="container">
          <div className="row">
            <SideBarTeacher />
            <div className="container col-md-9 mt-3">
              <div className="row">
                
              {users.filter(chat => chat.otherUser).map((chat) => (
    <div className="col-lg-4" key={chat._id}>
      <div className="card shadow p-2 mb-3">
        <div className="row g-0">
          <div className="col-md-4">
            <img src={chat.otherUser?.picturePath ? chat.otherUser.picturePath : process.env.PUBLIC_URL + '/defaultProfile.png'} alt="user" style={{ width: "130px", height: "auto", borderRadius: "10%" }} />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title mb-0">{chat.otherUser?.firstName} {chat.otherUser?.lastName}</h5>
              <button onClick={() => handleContact(chat.otherUser?._id)} className="btn btn-primary">Contacter</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

            </div>

            {showChatBox && ( // Rendre le ChatBox uniquement si showChatBox est vrai
              <div className="ChatBox-container" >
                <ChatBox
                  keyy={createdChatId}
                  chat={createdChatId}
                  currentUser={userId}
                  receiverId={reciveeeeeerId}
                  receivedMessage={receivedMessage}
                  onClose={() => setShowChatBox(false)}
                />

              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Index;
