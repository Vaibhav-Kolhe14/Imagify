import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const [user, setUser] = useState(false);

    const [showLogin, setShowLogin] = useState(false);

    const [token, setToken] = useState(localStorage.getItem('token'))

    const [credit, setCredit] = useState(false)

    const loadCreditsData = async() => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user/credits`, {headers: {token}})
            if(response.data.success) {
                setCredit(response.data.credits)
                setUser(response.data.user)
            }
        } catch (error) {
            console.log("Error in loadCreditsData", error)
            toast.error(error.message)
        }
    }

    const logout = ()=> {
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
    }

    useEffect(() => {
        if(token) {
            loadCreditsData()
        }
    }, [token])

    const value = {
        user, setUser, showLogin, setShowLogin, token, setToken, credit, setCredit, loadCreditsData, logout
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider