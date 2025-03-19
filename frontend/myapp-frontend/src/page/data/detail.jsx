import axios from "axios";
import { useState } from "react";
import { useAuth } from "../login/authContext";
import useDialog from "../alert/useDialog";
import useComplete from "../alert/useComplete";
import { apiUrl } from "../const";

/* eslint-disable react/prop-types */
function Detail({music,lists, deleteAlbum, updateAlbum, showDetail, toggleIs_fav}) {
    //date formatting
    function formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    const { showAlertDialog, renderDialogs } = useDialog();
    const { showCompleteContent, renderDialogsComplete} = useComplete();
    const {auth} = useAuth();

    const [firstMusic, setFirstMusic] = useState(music);
    const [edit, setEdit] = useState(false);
    const [formValues, setFormValues] = useState(firstMusic);
    //form onchange
    const handleChange = (e) => {
        const { name, value } = e.target;
            setFormValues((prevValues) => ({
                ...prevValues,
                [name] :( value ? value : null),
            }));
        };
        
    //validation check
    const assetCheck =()=>{
        setFormValues((prevValues)=>({
            ...prevValues,
            asset : (prevValues.asset !=0 ? prevValues.asset : null)
        }))
        const promise = new Promise(resolve => resolve());
        console.log('assetCheck is completed ! promise :', )
        return promise;
    }

    //updating music
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(!formValues.album || !formValues.artist){
                console.log('album :', formValues.album, ', artist :', formValues.artist, ', is_fav :', formValues.is_fav);
            }
            if(formValues.artist != firstMusic.artist){
                const isExists = [...lists].some((m)=>m.album == formValues.album && m.artist == formValues.artist);
                if(isExists){
                    alert('既に追加されています')
                    return;
                }
            }
            await assetCheck();
            const updateData ={
                album: firstMusic.album,
                artist: firstMusic.artist,
                newdata: formValues,
            }
            const response = await axios.patch(`${apiUrl}/api/music/user-music/${auth.username}/`,
                updateData,{
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            console.log('送信するデータ',updateData);
            setFirstMusic(formValues);
            updateAlbum(updateData);
            console.log('Update successfully', response.data);
            setEdit(false);
            await showCompleteContent();
        } catch (error) {
            console.error('Error updating music', error.response || error.message);
        }
    };
            
    const detail_ToggleIs_fav =(e)=>{
        toggleIs_fav(e);
        setFirstMusic((prevValues)=>({
            ...prevValues,
            is_fav : !firstMusic.is_fav
            }))
        setFormValues((prevValues)=>({
            ...prevValues,
            is_fav : !firstMusic.is_fav
            }))
        }

    //deleting music
    const handleDelete= async () =>{
        const deleteData ={
            album : firstMusic.album,
            artist : firstMusic.artist,
        }
        try {
            await showAlertDialog(async () => {
                console.log('送信するデータ' ,deleteData)
                const response = await axios.delete(`${apiUrl}/api/music/user-music/${auth.username}/`,{
                    data : deleteData},{
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                console.log('Delete successfully!', response.data);
            });
            console.log('Delete on clientside successfully!')
            deleteAlbum({album :firstMusic.album, artist :firstMusic.artist});
        } catch (error) {
            console.error('Error deleting music' ,error.response || error.message);
        }
    };



    return (
        <>
            <h2>詳細ページ </h2>
            <form onSubmit={handleSubmit}>
                <button type="button" className="" onClick={()=> showDetail('')}>メインページへ</button>
                <button type="button" onClick={() => {
                    setEdit(!edit);
                    setFormValues(firstMusic);
                    assetCheck();
                }}>{ !edit ? '編集':'戻る'}</button>
                { !edit ? 
                <button type="button" onClick={handleDelete}>削除</button> :
                <button type="submit" >更新</button>}
                <button type="button" className="is_fav" onClick={()=>detail_ToggleIs_fav(firstMusic)}>
                {(!edit ? firstMusic.is_fav : formValues.is_fav ) ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>
                :   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                    </svg>}</button>
                <div className="containers">
                    <table className="detail table">
                        <colgroup>
                            <col className="col-key" />
                            <col className="col-value" />
                            <col className="col-item" />
                        </colgroup>
                        <tfoot className="tfoot">
                            <tr className="">
                                <td><label htmlFor="">アルバム</label></td>
                                <td> {!edit ? firstMusic.album : formValues.album}</td>
                                <td className="image" colSpan={2}>
                                    {!edit ?
                                    <span className="href" >
                                        <a className="href" href={firstMusic.image} >アルバム画像URL</a>
                                    </span>
                                :
                                <><input className=""
                                        id="image"
                                        type="url"
                                        name="image"
                                        value={formValues.image}
                                        placeholder="アルバム画像url"
                                        onChange={handleChange}
                                    />
                                    </> }
                                </td>
                            </tr>
                            <tr className="artist">
                                <td><label htmlFor="artist">アーティスト</label></td>
                                <td>{ !edit ? firstMusic.artist :
                                    <input
                                    id="artist"
                                    name="artist"
                                    type="text"
                                    value={formValues.artist}
                                    onChange={handleChange}
                                />
                                }</td>
                                <td className="image-big" rowSpan={7} colSpan={2}>
                                { !edit ? 
                                <><img className="" src={firstMusic.image} alt={'画像'} />
                                </> :
                                <><img  className="image-big"
                                    src={formValues.image}
                                    alt={'画像'}
                                /></> }</td>
                            </tr>
                            <tr className="release">
                                <td><label htmlFor="release">リリース</label></td>
                                <td>{ !edit ? ( firstMusic.release && formatDate(firstMusic.release) ):
                                    <input
                                    id="release"
                                    type="date"
                                    name="release"
                                    value={formValues.release}
                                    onChange={handleChange}
                                    />}</td>
                            </tr>
                            <tr className="date">
                                <td><label htmlFor="date">日付</label></td>
                                <td>{ !edit ? (firstMusic.date && formatDate(firstMusic.date) ):
                                    <input
                                    id="date"
                                    type="date"
                                    name="date"
                                    value={formValues.date}
                                    onChange={handleChange}
                                />}</td>
                            </tr>
                            <tr className="asset">
                                <td><label htmlFor="asset">評価</label></td>
                                <td>{ !edit ? (firstMusic.asset !=0 ? firstMusic.asset :null) :
                                    <select
                                    name="asset"
                                    id="asset"
                                    value={formValues.asset || null}
                                    onChange={handleChange}
                                    >
                                    <option value= '0'>未設定</option>
                                    <option value='10'>10</option>
                                    <option value='9'>9</option>
                                    <option value='8'>8</option>
                                    <option value='7'>7</option>
                                    <option value='6'>6</option>
                                    <option value='5'>5</option>
                                    <option value='4'>4</option>
                                    <option value='3'>3</option>
                                    <option value='2'>2</option>
                                    <option value='1'>1</option>
                                </select>}</td>
                            </tr>
                            <tr className="memo">
                                <td><label htmlFor="memo">メモ</label></td>
                                <td>{!edit ? firstMusic.memo :
                                    <textarea
                                    name="memo"
                                    id="memo"
                                    value={formValues.memo}
                                    onChange={handleChange}
                                ></textarea>}</td>
                            </tr>
                            <tr className="co_artist">
                                <td><label htmlFor="co_artist">共作</label></td>
                                <td>{!edit ? firstMusic.co_artist :
                                    <input type="text" name="co_artist" id="co_artist" 
                                    value={formValues.co_artist}
                                    onChange={handleChange}
                                    />
                                }</td>
                            </tr>
                            <tr className="spotify">
                                <td><label htmlFor="spotifylink">spotify</label></td>
                                <td>{!edit ? 
                                    <a href={firstMusic.spotifylink}>{firstMusic.spotifylink}</a> :
                                    <input type="text" name="spotifylink" id="spotifylink"
                                    value={formValues.spotifylink}
                                    onChange={handleChange}
                                    placeholder="spotifylink"
                                    />
                                }</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                {renderDialogs()}
                {renderDialogsComplete()}
            </form>
        </>
    );
    
}

export default Detail;
