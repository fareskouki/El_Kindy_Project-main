import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../../api/UserRequests";
import BigChatBox from "../../components/BigChatBox/BigChatBox";

import useAxiosPrivate from "hooks/useAxiosPrivate";

const Conversation = ({ props,data, currentUser, online }) => {

  const [userData, setUserData] = useState(null)
  const dispatch = useDispatch()
  const axiosPrivate = useAxiosPrivate();
  const [currentChat, setCurrentChat] = useState(null);
  const [reciiiiver, setreciiiiver] = useState(null);
  useEffect(() => {

    const reciiiiver = data.members.find((id) => id !== currentUser)
  //  console.log(reciiiiver);

    const getUserData = async () => {
      try {
        const { data } = await axiosPrivate.get(`/auth/${reciiiiver}`);
        setUserData(data)
        
        dispatch({ type: "SAVE_USER", data: data })
      }
      catch (error) {
        console.log(error)
      }
    }

    getUserData();
  }, [])
    console.log("userData",userData);
   // console.log("currentChat",userData.reciiiiver);
    console.log("reciiiiver",reciiiiver);
  /*
<BigChatBox
  chat={currentChat}
  currentUser={reciiiiver} 
  userData={userData}
/>
*/ 

  return (
    <>
      <div className="follower conversation">
        <div>
          {online && <div className="online-dot"></div>}
          <img
            src={userData?.picturePath ? userData.picturePath : process.env.PUBLIC_URL + '/defaultProfile.png'}
            alt="Profile"
            className="followerImage"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />

          <div className="name" style={{ fontSize: '0.8rem' }}>
            <span>{userData?.firstName} {userData?.lastName}</span>
            <span style={{ color: online ? "#51e200" : "" }}><br></br>{online ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default Conversation;
