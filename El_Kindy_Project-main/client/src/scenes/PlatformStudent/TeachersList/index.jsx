import React, { useEffect, useState, useRef } from 'react';
import NavBar from "components/NavBar";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import SideBarStudent from 'components/SideBarStudent';
import TopBarTeacherStudent from 'components/TopBarTeacherStudent';
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

  

  const userId = accessToken ? jwtDecode(accessToken).id : "";

  useEffect(() => {
    const controller = new AbortController();
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get(`/auth/getAllUserByRole/teacher`, {
          signal: controller.signal
        });
        console.log(response.data); // Log response data to see if it contains the list of teachers
        setUsers(response.data.data); // Update the state with the array of teachers directly
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
  }, [axiosPrivate]);
  console.log("rrrrrrrrrrrrrr",users);
  // Dans votre composant Index
  const handleContact = async (id) => {
    try {
      const response = await axiosPrivate.get(`/chat/find/${userId}/${id}`);

      setExistingChat(response.data);

      if (response.status === 200 && response.data) {
        setCreatedChatId(response.data._id);

        if (response.data.members && response.data.members.length > 1) {
          setReciveeeeeerId(response.data.members[1]);
        } else {
          alert("Le chat n'a pas les membres requis.");
          return;
        }

      } else {
        const res = await createChat({ senderId: userId, receiverId: id}, axiosPrivate);
        if (res.status === 201 && res.data) {
          setCreatedChatId(res.data._id);

          if (res.data.members && res.data.members.length > 1) {
            setReciveeeeeerId(res.data.members[1]);
          } else {
            alert("Le chat créé n'a pas les membres requis.");
            return;
          }

        } else {
          alert("Une erreur s'est produite lors de la création du chat.");
          return;
        }
      }
    } catch (error) {
      console.error("Erreur lors de la recherche ou de la création du chat :", error);
      alert("Une erreur s'est produite lors de la recherche ou de la création du chat.");
      return;
    }
  };

  useEffect(() => {
    if (createdChatId) {
      setShowChatBox(true);
    }
  }, [createdChatId]);






  return (
    <div>
      <NavBar />
      <TopBarTeacherStudent />
      <section className="pt-0">
        <div className="container">
          <div className="row">
            <SideBarStudent />
            <div className="container col-md-9 mt-3">
              <div className="row">
                {users?.map((user) => (
                  <div className="col-lg-6" key={user._id}>
                    <div className="card shadow p-2 mb-3">
                      <div className="row g-0">
                        <div className="col-md-4">
                          <img src={user?.picturePath ? user.picturePath : process.env.PUBLIC_URL + '/defaultProfile.png'} alt="user" style={{ width: "130px", height: "auto", borderRadius: "10%" }} />
                        </div>
                        <div className="col-md-8">
                          <div className="card-body">
                            <div className="d-sm-flex justify-content-sm-between mb-2 mb-sm-3">
                              <div>
                                <h5 className="card-title mb-0">{user.firstName} {user.lastName}</h5>
                                <p className="small mb-2 mb-sm-0">{user.position}</p>
                              </div>
                              <span className="h6 fw-light">4.3<i className="fas fa-star text-warning ms-1" /></span>
                            </div>
                            <p className="text-truncate-2 mb-3">{user.description}</p>
                            <div className="d-sm-flex justify-content-sm-between align-items-center">
                              <h6 className="text-orange mb-0">{user.roles}</h6>
                              <ul className="list-inline mb-0 mt-3 mt-sm-0">
                                <button onClick={() => handleContact(user._id)} className="btn btn-primary">Contacter</button>
                              </ul>
                            </div>
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
