import {  useLocation } from "react-router-dom";
import { useAuth } from "../login/authContext";
import { useEffect, useState } from "react";
import axios from "axios";
import useComplete from "../alert/useComplete";
import { apiUrl } from "../const";

//user accoun setting
function Setting(){
    //input completion ON
    const location = useLocation();
    const autoCompleteValue = location.pathname === '/signup' ? 'off' : 'on';

    const {auth} =useAuth();
    const {showCompleteContent, renderDialogsComplete} = useComplete();

    useEffect(()=>{
        console.log(auth);
    }, [auth]);


    const [passNow, setPassNow] =useState(null);
    const firstData ={
        username: auth.username,
        tell:auth.tell,
        password: null,
    }
    const [userData, setUserData] =useState(firstData);
    const [edit, setEdit] =useState(false)
    const [verify, setVerify] =useState(false);
    const [passwordConfirm, setPasswordConfirm] =useState(null);

    //form onchange
    const handleChange =(e)=>{
        const {name, value} =e.target;
        setUserData((prevData)=>({
            ...prevData,
            [name] : value,
        }));
    }

    //verify account
    const handleVerify = async(e)=>{
        e.preventDefault();
        axios.post(`${apiUrl}/account/users/verify/`,
            {username: auth.username, password :passNow})
        .then(response =>{
            console.log('response :', response);
            setVerify(!verify);
            setUserData((prevData)=>({
                ...prevData,
                password : passNow
            }))
            console.log('Authorized!')
        })
        .then(()=> setPassNow(null))
        .catch(error =>{
            console.log('Error verifying password!', error.response? error.response.data : error.message);
        })

    }

    //update user account setting
    const handleSubmit =async(e)=>{
        if(userData.password !== passwordConfirm){
            alert('パスワードが一致しません')
            console.log('password :', userData.password, ' passwordConfirm :', passwordConfirm);
            return;
        }
        e.preventDefault();
        axios.post(`${apiUrl}/account/users/update/`,userData)
            .then(response =>{
                console.log('response :', response);
                console.log('Updating user setting !');
                setEdit(!edit);
                setVerify(!verify);
                setUserData(firstData);
                return;
            })
            .then(()=> showCompleteContent())
            .catch(error =>{
                console.log('Error updating user setting!', error.response || error.message);
            })
    };

    return(
        <>
            <h2>アカウント設定</h2>
            <form onSubmit={handleSubmit}>
                <button type="button" onClick={()=>{
                    setEdit(!edit);
                    setVerify(false);
                    setUserData(firstData);
                }} >{!edit ? '編集': '完了'}</button>
                { edit &&verify &&<button type="submit">更新</button>}
                <div className="containers">
                    <table className="users">
                        <colgroup>
                            <col className="col-key"/>
                            <col className="col-value" colSpan={2}/>
                        </colgroup>
                        <tbody className="tfoot">
                            <tr className="username">
                                <td><label htmlFor="username" id="username">ユーザID（メールアドレス）</label></td>
                                <td colSpan={2}>{auth.username}</td>
                            </tr>
                            <tr className="tell">
                                <td><label htmlFor="tell" id="tell">電話番号</label></td>
                                <td colSpan={2}>{!edit ? auth.tell :
                                    <input type="tell" name="tell" className="tell" id="tell" 
                                    required minLength={10} maxLength={15} 
                                    title="ハイフンなしで正しい電話番号を入力してください。例:090********"
                                    autoComplete={autoCompleteValue}
                                    onChange={handleChange}
                                    value={userData.tell}/>
                                    }</td>
                            </tr>
                            <tr className="password">
                                <td><label htmlFor="password" id="tell">
                                    {!edit ? 'パスワード' : 
                                    (!verify ? '現在のパスワード' : '新しいパスワード')}</label></td>
                                    {(!edit && !verify) && <td colSpan={2}>‥‥‥‥</td>}
                                    {(edit && !verify) && (<>
                                <td>
                                    <input type="password" name="password" className="password" id="password" 
                                    required minLength={8} pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$"
                                    title="英数字含む8文字以上の正しいパスワードを入力してください。"
                                    autoComplete="new-password"
                                    onChange={e =>{
                                        setPassNow(e.target.value);
                                        setPasswordConfirm(e.target.value);
                                    }}/>
                                </td>
                                <td>
                                    <button type="button" onClick={handleVerify}>確認</button>
                                </td>
                                </>)}
                                {(edit && verify) &&<td colSpan={2}>
                                    <input type="password" name="password" className="password" id="password" autoComplete={autoCompleteValue}
                                    required minLength={8} pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$"
                                    title="英数字含む8文字以上の正しいパスワードを入力してください。"
                                    onChange={handleChange}
                                    value={userData.password}
                                    />
                                </td>}
                            </tr>
                            {(edit && verify) &&
                            <tr className="passwordConfirm">
                                <td>新しいパスワード(確認)</td>
                                <td><input type="password" name="passwordConfirm" className="password" id="passwordConfirm"
                                    required minLength={8} pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$"
                                    title="英数字含む8文字以上の正しいパスワードを入力してください。"
                                    onChange={(e)=>setPasswordConfirm(e.target.value)}
                                    value={passwordConfirm}
                                    />
                                </td>
                            </tr>}
                        </tbody>
                    </table>
                </div>
                {renderDialogsComplete()}
            </form>
        </>
    )
}


export default Setting;