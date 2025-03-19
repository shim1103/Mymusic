import axios from 'axios';
import { useEffect,useState } from "react";
import { useAuth } from "../login/authContext";
import getAccessToken from "./getAccessToken";
import useComplete from "../alert/useComplete";
import { apiUrl } from '../const';

//adding music form
// eslint-disable-next-line react/prop-types
function Form({lists,addAlbum,form, showForm}) {
    const {auth} =useAuth();
    const {showCompleteContent, renderDialogsComplete} = useComplete();

    const initializeForm = {
        album: null, artist: null, release: null, date :null, asset :null, image : null, memo :null, 
        spotifylink: null, applelink:null, co_artist: null, is_fav :false, href :null,
    };
    const [formValues, setFormValues] =useState(initializeForm);
    
    const [token, setToken] = useState(null);
    const [albumName, setAlbumName] = useState('');
    const [artistName, setArtistName] = useState('');
    const [searchQuery, setSerachQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    //form onchange
    const handleChange =(e)=>{
        setFormValues((preValues)=>({
        ...preValues,
        [e.target.name] :(e.target.value ? e.target.value : null) ,
        }))
    };
    const toggleIs_fav = () => {
        setFormValues((prevValues) => ({
            ...prevValues,
            is_fav: !prevValues.is_fav,
        }));
    };
    const resetForm =()=>{
        setFormValues(initializeForm);
        setSuggestions([]);
    }
    
    //spotifyAPI calling
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const access_token = await getAccessToken();
                // console.log('access_token:', access_token);
                setToken(access_token);
            } catch (error) {
                console.error('Failed to fetch access token:', error);
            }
        };
        fetchToken();
    }, []); 

    useEffect(() => {
        if (token) {
            // console.log('Get access_token successfully! :', token);
        }
    }, [token]);

    //search query
    useEffect(() => {
        if (albumName && artistName) {
            setSerachQuery(`${encodeURIComponent(albumName)}+artist:${encodeURIComponent(artistName)}`);
        } else if (albumName) {
            setSerachQuery(encodeURIComponent(albumName));
        } else if (artistName) {
            setSerachQuery(`artist:${encodeURIComponent(artistName)}`);
        } else {
            setSerachQuery('');
            setSuggestions([])
        }
    }, [albumName, artistName]);

    //search album
    useEffect(() => {
        const fetchData = async () => {
            if (!searchQuery || !token) {
                return;
            }
            try {
                const response = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=album&limit=16`, {
                headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Search error:', errorData);
                    return;
                }
                const albumData = await response.json();
                console.log("albumData :",albumData);
                setSuggestions(albumData.albums.items);
                console.log("suggestions :", albumData.albums.items)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
        }, [searchQuery, token]);

    //select album
    const handleAlbumClick = (album) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            album: album.name,
            artist: album.artists[0].name,
            image: album.images[0]?.url,
            release: album.release_date,
            spotifylink: album.external_urls.spotify,
            co_artist : album.artists.length > 1 ? 
                (() => {
                    let temp = album.artists[1].name;
                    for (let i = 2; i < album.artists.length; i++) {
                        temp += ',' + album.artists[i].name;
                    }
                    return temp;
                })(): null,
            href : album.href,
            }
        ))
    };

    //adding music
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formValues.album || !formValues.artist) {
            console.log('album :', formValues.album, ', artist :', formValues.artist, ', is_fav :', formValues.is_fav);
            return;
        }

        const isExists = lists.some((m) => m.album === formValues.album && m.artist === formValues.artist);
        
        if (isExists) {
            alert('既に追加されています');
            return;
        }

        console.log('送信するデータ', formValues);

        try {
            const response = await axios.post(`${apiUrl}/api/music/user-music/${auth.username}/`, formValues, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log('Adding successfully! :', response.data);
            addAlbum(formValues);
            setAlbumName('');
            setArtistName('');
            resetForm();
            console.log('Reset form!');
            showCompleteContent();
        } catch (error) {
            console.error('Error adding music', error.response || error.message);
        }
    };

    return (
                <fieldset className="form">
                    <form onSubmit={handleSubmit} >
                        <button type="button" onClick={()=>showForm(!form)}>完了</button>
                        <button type="submit">追加</button>
                        <button type="button" className="is_fav" 
                            onClick={toggleIs_fav} value={formValues.is_fav}> 
                            {formValues.is_fav ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                            </svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                            </svg>}</button>
                        <button type="reset" name="reset" onClick={resetForm}>リセット</button>
                        <div className="containers">
                            <table className="detail form table">
                                <colgroup>
                                <col className="col-key" />
                                <col className="col-value" />
                                <col className="col-item" />
                                </colgroup>
                                <tfoot className="tfoot">
                                    <tr className="album">
                                        <td><label htmlFor="album">アルバム</label></td>
                                        <td>
                                            <input id="album" name="album" type="text" required
                                            value={formValues.album=== null ? '' : formValues.album}
                                            title="必須項目です。"
                                            onChange={e => {
                                                handleChange(e);
                                                setAlbumName(e.target.value);
                                            }}
                                            />
                                        </td>
                                        <td className="image"  colSpan={4}>
                                            <input
                                            type="url" name="image"
                                            placeholder="アルバム画像URL"
                                            onChange={(e)=> handleChange(e)}
                                            value={formValues.image===null ?'' : formValues.image}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td><label htmlFor="artist">アーティスト</label></td>
                                        <td>
                                            <input id="artist" name="artist" type="text" required
                                            value={formValues.artist === null ? '' : formValues.artist}
                                            title="必須項目です。"
                                            onChange={e => {
                                            handleChange(e);
                                            setArtistName(e.target.value);
                                            }}
                                            />
                                        </td>
                                        <td className="image-row" rowSpan={7} colSpan={4}>
                                            { !formValues.image ?
                                                <div className="image-grid">
                                                {suggestions.map((album) => (
                                                    <div key={album.id} className="image-item">
                                                        <button type="button" className="image-button" onClick={() => handleAlbumClick(album)}>
                                                            <img className="album-image"
                                                                src={album.images[0]?.url}
                                                                alt={album.name}
                                                                />
                                                            <p className="image-name">{album.name}</p>
                                                        </button>
                                                    </div>
                                                ))}
                                                </div>
                                                :
                                                <div className="image-big">
                                                    <img
                                                    src={formValues.image === null ? '' : formValues.image}
                                                    alt={formValues.album === null ? '' : formValues.album}
                                                />
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td><label htmlFor="release">リリース</label></td>
                                        <td>
                                            <input
                                            id="release" type="date" name="release"
                                            value={formValues.release === null ? '' : formValues.release}
                                            onChange={e => handleChange(e)}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td><label htmlFor="date">日付</label></td>
                                        <td>
                                            <input
                                                id="date" type="date" name="date"
                                                value={formValues.date === null ? '' : formValues.date}
                                                onChange={e => {handleChange(e)}}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td><label htmlFor="asset">評価</label></td>
                                        <td>
                                            <select name="asset" id="asset"
                                            value={formValues.asset === null ? '0' : formValues.asset }
                                            onChange={e => handleChange(e)}
                                            >
                                            <option value='0'>未設定</option>
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
                                            </select>
                                        </td>
                                    </tr>
                                    <tr className="memo">
                                        <td><label htmlFor="memo">メモ</label></td>
                                        <td>
                                            <textarea name="memo" id="memo" maxLength={200}
                                            value={formValues.memo === null ? '' : formValues.memo}
                                            onChange={e => {handleChange(e)}}
                                            ></textarea>
                                        </td>
                                    </tr>
                                    <tr className="co_artist">
                                        <td><label htmlFor="co_artist">共作</label></td>
                                        <td>
                                            <input type="text" id="co_artist" name="co_artist"
                                            value={formValues.co_artist === null ? '' : formValues.co_artist}
                                            onChange={e => handleChange(e)} /></td>
                                    </tr>
                                    <tr className="spotifylink">
                                        <td><label htmlFor="spotifylink">spotify</label></td>
                                        <td>
                                            <input type="text" name="spotifylink" id="spotifylink"
                                            value={formValues.spotifylink === null ? '' : formValues.spotifylink}
                                            onChange={e=>handleChange(e)}
                                            placeholder="spotifylink"
                                            />
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </form>
                    {renderDialogsComplete()}
                </fieldset>
    );

}

export default Form;
