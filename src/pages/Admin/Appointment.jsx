import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const Appointment = () => {
  const { aToken, appointments, getAllAppointments,cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
  //This creates a state variable searchTerm that stores whatever text the admin types into the search box
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  // Filter appointments by doctor name
  const filteredAppointments = appointments.filter((item) => //appointments is your full list (from backend / context).
    item.docData.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  );//For each appointment (item), it checks: does the doctor’s name (like "Dr. Sarah Patel") contain the text typed in searchTerm?
  //If it matches, it keeps that appointment; otherwise, it hides it.

  return (
    <div className="w-full max-w-6xl m-5">
      <div className="flex justify-between items-center mb-3">
        <p className="text-lg font-medium">All Appointments</p>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by doctor name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm w-64 outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll hide-scrollbar">
        {/* Header row */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] grid-flow-col py-3 px-6 border-b font-semibold text-gray-700 bg-gray-50">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {/* Filtered results */}
        {filteredAppointments.length > 0 ? (
          filteredAppointments.reverse().map((item, index) => (
            <div
              className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
              key={index}
            >
              <p className="max-sm:hidden">{index + 1}</p>
              <div className="flex items-center gap-2">
                <img className="w-8 rounded-full" src={item.userData.image} alt="" />
                <p>{item.userData.name}</p>
              </div>
              <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>
              <div className="flex items-center gap-2">
                <img className="w-8 rounded-full bg-gray-200" src={item.docData.image} alt="" />
                <p>{item.docData.name}</p>
              </div>
              <p>
                {currency}
                {item.amount}
              </p>
              {
                item.cancelled
                ? <p className='text-red-500 text-xs font-medium'>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                  : <div className='flex'>
                      <img onClick={()=>cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                    </div>
              }
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default Appointment;
