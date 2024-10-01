import { Outlet, useNavigate} from 'react-router-dom';
import { useAuth } from './authContext';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { apiUrl } from '../const';

//autheticated superuser can access
export const ProtectedSuper = () => {
    let {auth} = useAuth();
    const nav =useNavigate();
    const handleClick =() => nav('/');
    const [isSuper, setIsSuper] = useState(null);

    useEffect(()=>{
        if(auth){ 
            console.log('auth :', auth);
        }
        axios.post(`${apiUrl}/account/users/superuser/`,{username :auth.username})
            .then(res =>{
                setIsSuper(res.data);
                console.log(res);
            })
            .catch(error =>{
                console.error('Error verifying superuser', error.response || error.message)
            })
    })



    if (!isSuper) {
        console.log('Not superuser!')
        return(
            <>
                <p>存在しないページ「users」</p>
                <button onClick={handleClick}>OK</button>
            </>
        ) ;
    }else{
        console.log('SuperUser is coming!')
        return <Outlet/>;
    }
    
};

