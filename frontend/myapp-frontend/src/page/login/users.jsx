import axios from "axios";
import { useEffect, useState } from "react";
import useDialog from "../alert/useDialog";
import useComplete from "../alert/useComplete";
import { useAuth } from "./authContext";
import { apiUrl } from "../const";

//users list
function Users() {
    const [loading, setLoading] = useState(true);
    const { showAlertDialog, renderDialogs } = useDialog();
    const { showCompleteContent, renderDialogsComplete } = useComplete();
    const { auth } = useAuth();

    const [lists, setLists] = useState([]);

    //database connection
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${apiUrl}/account/users/`);
                const data = await res.json();
                const formattedData = data.map(user => ({
                    ...user,
                }));
                console.log('Users data :', data);

                const superUser = [...formattedData].filter((m) => m.username === auth.username);
                const otherUsers = [...formattedData].filter((m) => m.username !== auth.username);
                const arrayedUsers = superUser.concat(otherUsers);
                setLists(arrayedUsers);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [auth.username]);

    //delete user account
    const handleDelete = async (e) => {
        console.log('削除するユーザ :', e);
        showAlertDialog('このユーザーを削除しますか？', async () => {
            try {
                await axios.delete(`${apiUrl}/account/users/delete/`, {
                    params: { username: e.username }
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Delete account :', e.username);
                await showCompleteContent('ユーザーを削除しました');
                window.location.reload();
            } catch (error) {
                console.error('Error deleting account! ', error.response || error.message);
            }
        });
    }

    return (
        <>{loading ? <p>Loading...</p> :
            <>
                <h2>ユーザ一覧</h2>
                <div className="containers">
                    <table className="users">
                        <colgroup>
                            <col className="col-number" />
                            <col className="col-username" />
                            <col className="col-tell" />
                            <col className="col-password" />
                            <col className="col-delete" />
                        </colgroup>
                        <thead>
                            <tr>
                                <td className="number">番号</td>
                                <td className="username">ユーザID</td>
                                <td className="tell">電話番号</td>
                                <td className="password">パスワード</td>
                            </tr>
                        </thead>
                        <tfoot className="tfoot">
                            {lists.map((e, index) => (
                                <tr key={index}
                                    className={index === 0 ? "super" : `user${index + 1}`}>
                                    <td className="number">{index === 0 ? "super" : index}</td>
                                    <td className="username">{e.username}</td>
                                    <td className="tell">{e.tell}</td>
                                    <td className="password">‥‥‥‥</td>
                                    <td className="delete">{index !== 0 ?
                                        <button type="button" onClick={() => handleDelete(e)}>削除</button>
                                        : '削除不可'}</td>
                                </tr>
                            ))}
                        </tfoot>
                    </table>
                    {renderDialogs()}
                    {renderDialogsComplete()}
                </div>
            </>
        }
        </>
    )
}


export default Users;