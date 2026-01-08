import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const Doctorlist = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability,deleteDoctor } = useContext(AdminContext); //usage of context:we once define use any whare

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]); // when token is updated then doctors list is provided

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll hide-scrollbar">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((item, index) => {
          return ( // use return inside {} or use () for implicit return in map
            // earlier images not showing because map didn’t return JSX — fixed by adding return
            <div className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group" key={index}>
              <img className="bg-indigo-50 group-hover:bg-[#5f6FFF] transition-all duration-500" src={item.image} alt="doctor" />
              <div className="p-4">
                <p className="text-neutral-800 text-lg font-medium">{item.name}</p>
                <p className="text-zinc-600 text-sm">{item.speciality}</p>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} />
                  <p>Available</p>
                </div>
                <button
                  onClick={() => deleteDoctor(item._id)}
                  className="mt-3 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                    Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Doctorlist;
