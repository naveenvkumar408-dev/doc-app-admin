import axios from "axios";
import { use } from "react";
import { createContext, useState } from "react";
import { data } from "react-router-dom";
import { toast } from "react-toastify";

export const AdminContext = createContext()

const AdminContextProvider = (props) =>{
    //We are trying to get jsonwebtoken from backend to frontend
    //we check user is login or not by this useState(localStorage.getItem('aToken')?(localStorage.getItem('aToken')):''
    //when token is expaired then we provide login page to user or else user can use the local stored token to login
    const [aToken,setAToken] = useState(localStorage.getItem('aToken')?(localStorage.getItem('aToken')):'')
    const [doctors,setDoctors] = useState([]) //this array is store the list of doctors
    const [appointments,setAppointments] = useState([]) //this array is store the list of appointments
    const [dashData,setDashData] = useState(false) //this state is store the dashboard data

    const backendUrl = import.meta.env.VITE_BACKEND_URL // conection of backend and frontend

    //we have to call the all-doctors api which is created in backend
    const getAllDoctors = async () =>{

        try {
            //we have destructure the api
            const {data} = await axios.post(backendUrl + '/api/admin/all-doctors',{},{headers:{aToken}})  //we provide token to check whether user is authorized or not
            if(data.success) {
                setDoctors(data.doctors) //if authorized show doctors list otherwise send error message
                console.log(data.doctors)
            } else {
                toast.error(data.message) //there is a problem with api
            }
        } catch (error) {
            toast.error(data.message) //server error
        }

    }

    const changeAvailability = async (docId) => {

        try {
            
            const {data} = await axios.post(backendUrl + '/api/admin/change-availability',{docId},{headers:{aToken}})
            if (data.success) {
                toast.success(data.message) //if authorized availability changed
                getAllDoctors() //re render the all doctors once again with changed value
            } else {
                toast.error(data.message) //api error or server error
            }

        } catch (error) {
            toast.error(data.message)
        }

    }

    const getAllAppointments = async () =>{

        try {
            
            const {data} = await axios.get(backendUrl+'/api/admin/appointments',{headers:{aToken}})

            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(data.message)
        }

    }

    const getDashData = async () =>{

        try {
            
            const {data} = await axios.get(backendUrl+'/api/admin/dashboard',{headers:{aToken}})

            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    const cancelAppointment = async (appointmentId) => {

        try {
            
            const {data} = await axios.post(backendUrl + '/api/admin/cancel-appointment',{appointmentId},{headers:{aToken}})//we provide token to check whether user is authorized or not

            if (data.success) {
                toast.success(data.message) //if authorized appointment canceled
                getAppointments() //re render the all appointments once again with changed value
            } else{
                toast.error(data.message) //api error or server error
            }

        } catch (error) {
            console.log(error)
            toast.error(data.message)
        }

    }

    const deleteDoctor = async (docId) => {
        if (!window.confirm("Are you sure you want to delete this doctor permanently?")) return;

        try {
            const { data } = await axios.post(backendUrl + '/api/admin/delete-doctor',{ docId },{ headers: { aToken } });

            if (data.success) {
                toast.success("Doctor deleted successfully");
                getAllDoctors(); // refresh list
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error("Error deleting doctor");
        }
    };


    const value ={
        aToken,setAToken,
        backendUrl,doctors,
        getAllDoctors,changeAvailability,
        appointments,setAppointments,
        getAllAppointments,dashData,
        getDashData, cancelAppointment,deleteDoctor
    }
    return(
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider