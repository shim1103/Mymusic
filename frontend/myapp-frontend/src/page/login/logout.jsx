import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import useDialog from '../alert/useDialog';
import { apiUrl } from '../const';

//logout
function Logout() {
    const nav = useNavigate();
    const {logout} = useAuth();
    const {showAlertDialog, renderDialogs} = useDialog();

    //logout
    const handleLogout = async() => {
            showAlertDialog(()=>{
                axios.post(`${apiUrl}/account/users/logout/`)
                .then(()=>{
                    logout();
                    nav('/login');
                    console.log('logout successfully!')
                })
                .catch (error=> {
                    console.error('Logout failed:', error.response || error.message);
                    alert('logout failed!')
                })
            })
    };

    return (
        <>
            <button className="link_button" onClick={handleLogout}>ログアウト</button>
            {renderDialogs('ログアウトしますか？')}
        </>
    );

}

export default Logout;
