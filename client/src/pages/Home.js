import React, {useEffect} from 'react';
import axios from "axios";
import Layout from "../components/Layout";
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
        <Layout>
            <h1> HomePage</h1>
        </Layout>
    );
}
export default Home;
