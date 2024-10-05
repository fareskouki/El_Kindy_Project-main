import NavBar from "components/NavBar";
import React, { useEffect, useState } from "react";
import TopBarTeacherStudent from "components/TopBarTeacherStudent";

import Footer from "components/Footer";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { getUserById } from "services/usersService/api";
import SideBarStudent from 'components/SideBarStudent';

function TimeSlotsStudent() {
  const accessToken = useSelector((state) => state.accessToken);
  const tokenUser = accessToken ? jwtDecode(accessToken) : "";
  const [userData, setUserData] = useState({});

  //refresh token
  const axiosPrivate = useAxiosPrivate();

  //table time
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await getUserById(tokenUser.id);
        setUserData(response.data.user);
        setSelectedTimeSlots(response.data.user.disponibilite || []);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  // Function to handle cell click
  const handleCellClick = (day, startTime, endTime) => {
    const timeSlot = { day, startTime, endTime };
    // Check if the time slot is already selected
    const isSelected = selectedTimeSlots.some(
      (slot) =>
        slot.day === timeSlot.day &&
        slot.startTime === timeSlot.startTime &&
        slot.endTime === timeSlot.endTime
    );

    if (isSelected) {
      // Deselect the time slot
      setSelectedTimeSlots((prevSelected) =>
        prevSelected.filter(
          (slot) =>
            !(
              slot.day === timeSlot.day &&
              slot.startTime === timeSlot.startTime &&
              slot.endTime === timeSlot.endTime
            )
        )
      );
    } else {
      // Select the time slot
      setSelectedTimeSlots((prevSelected) => [...prevSelected, timeSlot]);
    }
  };

  // Function to handle cell hover
  const handleCellHover = (day, startTime, endTime) => {
    if (isMouseDown) {
      handleCellClick(day, startTime, endTime);
    }
  };

  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const isSelectable = (day, hour, minute) => {
    if (day === "Saturday" || day === "Sunday") {
      return true; // Allow selection on Saturday and Sunday
    }

    const nonSelectableHours = [
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
    ];
    const currentTime = `${hour}:${minute < 10 ? "0" : ""}${minute}`;

    return !nonSelectableHours.includes(currentTime);
  };

  // Function to send updated time slots to backend
  const handleUpdateTimeSlots = async () => {
    try {
      const response = await axiosPrivate.put(
        `/auth/updateTimeSlots/${tokenUser.id}`,
        {
          disponibilite: selectedTimeSlots,
        }
      );
      if (response.status === 200) {
        // Password updated successfully
        alert('Time slots updated successfully!');

      } else {
        console.error('Failed to update timeSlot ', response.data.message);
        alert('Failed to update time Slots. Please try again later.');
      }
      // Handle success response as needed
    } catch (error) {
      console.error("Error updating time slots:", error);
      // Handle error response as needed
    }
  };

  return (
    <div>
      <main>
        <NavBar />
        <TopBarTeacherStudent />
        <section className="pt-0">
          <div className="container">
            <div className="row">
              <SideBarStudent />
              {/* Main content START */}
              <div className="col-xl-9">
                <div className="card bg-transparent border rounded-3 ">
                  {/* Availability */}
                  <div className="m-3">
                    <h6 className="mb-lg-0" id="heading-3">
                      AVAILABLE TIME SLOTS
                    </h6>
                    <div>
                      <div className=" mt-3">
                        <div className="table-responsive">
                          <table className="calendar-table">
                            <thead>
                              <tr>
                                <th className="time-column"></th>
                                {dayNames.map((day) => (
                                  <th key={day}>{day}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {[...Array(20)].map((_, index) => {
                                const startHour = Math.floor(index / 2) + 10;
                                const startMinute =
                                  index % 2 === 0 ? "00" : "30";
                                const endHour =
                                  Math.floor((index + 1) / 2) + 10;
                                const endMinute =
                                  (index + 1) % 2 === 0 ? "00" : "30";
                                const startTime = `${startHour}:${startMinute}`;
                                const endTime = `${endHour}:${endMinute}`;

                                return (
                                  <tr key={index}>
                                    <td className="time-column">
                                      {startTime} - {endTime}
                                    </td>
                                    {dayNames.map((day, dayIndex) => (
                                      <td
                                        key={dayIndex}
                                        className={`
                      ${
                        !isSelectable(day, startHour, parseInt(startMinute))
                          ? "non-selectable-cell"
                          : ""
                      }
                      ${
                        selectedTimeSlots.some(
                          (slot) =>
                            slot.day === day &&
                            slot.startTime === startTime &&
                            slot.endTime === endTime
                        )
                          ? "selected"
                          : ""
                      }
                    `}
                                        onClick={() =>
                                          isSelectable(
                                            day,
                                            startHour,
                                            parseInt(startMinute)
                                          ) &&
                                          handleCellClick(
                                            day,
                                            startTime,
                                            endTime
                                          )
                                        }
                                        onMouseEnter={() =>
                                          isSelectable(
                                            day,
                                            startHour,
                                            parseInt(startMinute)
                                          ) &&
                                          handleCellHover(
                                            day,
                                            startTime,
                                            endTime
                                          )
                                        }
                                        onMouseDown={() => setIsMouseDown(true)}
                                        onMouseUp={() => setIsMouseDown(false)}
                                      ></td>
                                    ))}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Button to update time slots */}
                  <div className="text-center mt-4 mb-2">
                    <button
                      onClick={handleUpdateTimeSlots}
                      className="btn btn-primary"
                    >
                      Update Time Slots
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}

export default TimeSlotsStudent;
