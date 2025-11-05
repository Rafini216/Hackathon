import {useState, useEffect} from 'react'

const [newUser, setNewUser] = useState([])


useEffect(() => {

})




const resgister = () => {
    try {
        const data =  
        localStorage.setItem('userData', JSON.stringify(newUser))
    } catch (error) {
        
    }
} 

return {

}