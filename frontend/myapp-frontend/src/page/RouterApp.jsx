import axios from 'axios';
import { NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Logout from './login/logout';
import { useAuth } from './login/authContext';
import { apiUrl } from './const';
import './page.css'

//title & menu content
function RouterApp() {
    const [showMenu, setShowMenu] = useState(false);
    const auth = useAuth();
    const [isSuper, setIsSuper] = useState(null);

    useEffect(() => {
        const checkSuperUser = async () => {
            try {
                const res = await axios.post(`${apiUrl}/account/users/superuser/`, {
                    username: auth.auth.username
                });
                setIsSuper(res.data);
            } catch (error) {
                console.error('Error verifying superuser', error.response || error.message);
            }
        };
        checkSuperUser();
    }, []); // Add dependency array to prevent infinite loop

    return (
        <>
            <div className="router">
                <header>
                    <span className="title">My music</span>
                    <div className='menus'>
                        <button className='navbar-toggler' onClick={() => setShowMenu(!showMenu)}>
                            <span className="navbar-toggler-icon">メニュー</span>
                        </button>
                        <div className={`menu ${showMenu ? 'show' : ''}`}>
                            <ul className="list">
                                {isSuper && (
                                    <li>
                                        <button className='link_button' onClick={() => setShowMenu(false)}>
                                            <NavLink className='b' to='/users'>ユーザ一覧</NavLink>
                                        </button>
                                    </li>
                                )}
                                <li>
                                    <button className='link_button' onClick={() => setShowMenu(false)}>
                                        <NavLink className='b' to='/'>メインページ</NavLink>
                                    </button>
                                </li>
                                <li>
                                    <button className='link_button' onClick={() => setShowMenu(false)}>
                                        <NavLink className='b' to='/setting'>設定</NavLink>
                                    </button>
                                </li>
                                <li><Logout /></li>
                            </ul>
                        </div>
                    </div>
                </header>
            </div>
            <div className='outlet'>
                <Outlet />
            </div>
        </>
    )
}

export default RouterApp;