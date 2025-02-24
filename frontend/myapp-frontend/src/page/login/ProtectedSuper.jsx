import { Outlet, useNavigate} from 'react-router-dom';
import { useAuth } from './authContext';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { apiUrl } from '../const';

//authenticated superuser can access
export const ProtectedSuper = () => {
    let {auth} = useAuth();
    const nav = useNavigate();
    const handleClick = () => nav('/');
    const [isSuper, setIsSuper] = useState(null);

    useEffect(() => {
        const checkSuperUser = async () => {
            if(auth) {
                console.log('auth :', auth);
                try {
                    const response = await axios.post(`${apiUrl}/account/users/superuser/`, {
                        username: auth.username
                    });
                    setIsSuper(response.data);
                    console.log(response);
                } catch (error) {
                    console.error('Error verifying superuser', error.response || error.message);
                }
            }
        };
        
        checkSuperUser();
    }, [auth]); // Added dependency array

    if (!isSuper) {
        console.log('Not superuser!')
        return(
            <>
                <p>存在しないページ「users」</p>
                <button onClick={handleClick}>OK</button>
            </>
        );
    } else {
        console.log('SuperUser is coming!')
        return <Outlet/>;
    }
};
