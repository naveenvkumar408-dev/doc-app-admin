import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext()

const DoctorContextProvider = (props) =>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken,setDToken] = useState(localStorage.getItem('dToken')?(localStorage.getItem('dToken')):'') //we are trying to get jsonwebtoken from backend to frontend
    const [appointments,setAppointments] = useState([]) //this array is store the list of appointments for doctor
    const [dashData,setDashData] = useState(false) //this state is used to store dashboard data for doctor
    const [profileData,setProfileData] = useState(false) //this state is used to store profile data for doctor

    const getAppointments = async () =>{

        try {
            
            const {data} = await axios.get(backendUrl+'/api/doctor/appointments',{headers:{dToken}}) //we provide token to check whether user is authorized or not

            if (data.success) {//if authorized show appointments list otherwise send error message
                setAppointments(data.appointments)
                console.log(data.appointments)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(data.message)
        }

    }

    const completeAppointment = async (appointmentId) => {

        try {
           
            const {data} = await axios.post(backendUrl + '/api/doctor/complete-appointment',{appointmentId},{headers:{dToken}})//we provide token to check whether user is authorized or not

            if (data.success) {
                toast.success(data.message) //if authorized appointment marked as completed
                getAppointments() //re render the all appointments once again with changed value
            } else{
                toast.error(data.message) //api error or server error
            }
            
        } catch (error) {
            console.log(error)
            toast.error(data.message)
        }

    }

    const getDashData = async () => {

        try {
            
            const {data} = await axios.get(backendUrl + '/api/doctor/dashboard',{headers:{dToken}})//we provide token to check whether user is authorized or not

            if (data.success) {
                setDashData(data.dashData) //if authorized set dashboard data
                console.log(data.dashData) 
            }else{
                toast.error(data.message) //api error or server error
            }

        } catch (error) {
            console.log(error)
            toast.error(data.message)
        }

    }

    const getProfileData = async () => {

        try {
            
            const {data} = await axios.get(backendUrl + '/api/doctor/profile',{headers:{dToken}})//we provide token to check whether user is authorized or not

            if (data.success) {
                setProfileData(data.profileData) //if authorized set profile data
                console.log(data.profileData) 
            } else {
                toast.error(data.message) //api error or server error
            }

        } catch (error) {
            console.log(error)
            toast.error(data.message)
        }

    }


    //context value, which will be provided to all components
    const value ={ 
        backendUrl,
        dToken,
        setDToken,appointments,
        getAppointments,setAppointments,
        completeAppointment,
        dashData,getDashData,setDashData,
        profileData,getProfileData,setProfileData
    }
    return(
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider