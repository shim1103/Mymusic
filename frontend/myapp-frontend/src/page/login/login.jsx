import axios from "axios";
import {  useState } from "react";
import { NavLink, useLocation, useNavigate ,} from "react-router-dom";
import { useAuth } from "./authContext";
import useComplete from "../alert/useComplete";
import { apiUrl } from "../const";

function Login() {
    //input completion ON
    const location = useLocation();
    const autoCompleteValue = location.pathname === '/signup' ? 'off' : 'on';

    const {showCompleteContent, renderDialogsComplete} = useComplete();
    const {login} = useAuth();
    const nav = useNavigate();

    const [loginData, setLoginData] = useState({
        username: "",
        password: ""
    });

    //input form onchange
    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    //login
    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("loginData :", loginData); 
        axios.post(`${apiUrl}/account/users/login/`, {
                username: loginData.username,
                password: loginData.password,
            })
            .then((response)=>{
                const data = response.data;
                console.log('Response.data :', data )
                login(data)
                showCompleteContent()
                .then(()=>nav('/'))
            })
            .catch (error=> {
            console.log('Error logging in', error.response || error.message);
        })
    }


    return (
        <>
            <h1>My music</h1>
            <div className="userbox">
            <h2 className="h2title">ログイン</h2>
            <form autoComplete={autoCompleteValue} onSubmit={handleLogin}>
                <label htmlFor="username">ユーザID(メールアドレス)
                    <input id="username" type="text" name="username" placeholder="ユーザID"
                        required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" 
                        title="正しいメールアドレスを入力してください。例: user@example.com"
                        onChange={handleChange}
                        autoComplete={autoCompleteValue}
                    />
                </label>
                <label htmlFor="password">パスワード(英数字含む8文字以上)
                    <input id="password" type="password" name="password" placeholder="パスワード"
                        required minLength={8} pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$"
                        title="英数字含む8文字以上の正しいパスワードを入力してください。"
                        onChange={handleChange}
                        autoComplete={autoCompleteValue}
                    />
                </label>
                <button className="logbutton" type="submit" >ログイン</button>
            </form>
                <NavLink className="loglink" to='/signup'>新規登録ページへ</NavLink>
            </div>
            {renderDialogsComplete('ログイン！')}
        </>
    );
}

export default  Login;