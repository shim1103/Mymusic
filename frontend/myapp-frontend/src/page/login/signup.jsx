import axios from "axios";
import {  useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useComplete from "../alert/useComplete";
import { apiUrl } from "../const";

function SignUp() {
    //input completion OFF
    const location = useLocation();
    const autoCompleteValue = location.pathname === '/signup' ? 'off' : 'on';

    const nav = useNavigate();
    const {showCompleteContent, renderDialogsComplete} = useComplete();

    const [signUpData, setSignUpData] = useState({
        username: "",
        tell: "",
        password: "",
        passwordConfirm: ""
    });

    //input form onchange
    const handleChange = (e) => {
        setSignUpData({
            ...signUpData,
            [e.target.name]: e.target.value
        });
    };

    //signup
    const handleSignUp = async (e) => {
        e.preventDefault();
        if (signUpData.password !== signUpData.passwordConfirm) {
            alert('パスワードが一致しません');
            console.log('password :',signUpData.password, ', passwordConfirm :', signUpData.passwordConfirm );
            return;
        }
        console.log("signUpData :", signUpData);

        axios.post(`${apiUrl}/account/users/`,{
                username: signUpData.username,
                tell: signUpData.tell,
                password: signUpData.password,
            },{
                    headers: {
                      'Content-Type': 'application/json',
                    }}
            )
            .then(response => {
                console.log('response.data :',response.data);
                showCompleteContent()
                .then(()=>nav('/login'));
            })
            .catch (error=> {
                if(error.response.data.type == "UsernameExists"){
                    alert("既にユーザが存在します")
                } 
                console.log('Error signing up', error.response || error.message);
            })
    };

    return (
        <>
            <h1>My music</h1>
                <div className="userbox">
                <h2 className="h2title">新規登録</h2>
                    <form autoComplete={autoCompleteValue} onSubmit={handleSignUp}>
                        <label htmlFor="username">ユーザID(メールアドレス)
                            <input id="username" type="email" name="username" 
                            required 
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                            title="正しいメールアドレスを入力してください。例: user@example.com"
                            onChange={handleChange} autoComplete={autoCompleteValue} />
                        </label>
                        <label htmlFor="tell">電話番号
                            <input id="tell" type="tell" name="tell" 
                            required minLength={10} maxLength={15} 
                            title="ハイフンなしで正しい電話番号を入力してください。例:090********"
                            onChange={handleChange} autoComplete={autoCompleteValue} />
                        </label>
                        <label htmlFor="password">パスワード(英数字含む8文字以上)
                            <input id="password" type="password" name="password"
                            required minLength={8} pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$"
                            title="英数字含む8文字以上の正しいパスワードを入力してください。"
                            onChange={handleChange} autoComplete='new-password'/>
                        </label>
                        <label htmlFor="passwordConfirm">パスワード(確認用)
                            <input id="passwordConfirm" type="password" name="passwordConfirm"
                            required minLength={8} pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$"
                            title="英数字含む8文字以上の正しいパスワードを入力してください。"
                            onChange={handleChange} autoComplete={autoCompleteValue} />
                        </label>
                        <button className="logbutton" type="submit">新規登録</button>
                    </form>
                        <NavLink className="loglink" to='/login'>ログインページへ</NavLink>
                </div>
            {renderDialogsComplete('新規登録完了')}
        </>
    );
}

export default SignUp;
