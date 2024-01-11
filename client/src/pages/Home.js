import React, {useEffect} from 'react';
import axios from "axios";
function Home(props) {
    const getData = async ()=>{
        try {
            const response = await axios.post('/api/user/get-user-info-by-id',{}, {
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            console.log(response.data);
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(()=>{
        getData();
    },[])
    return (
        <div>Doctor Booking App</div>
    );
}
export default Home;
