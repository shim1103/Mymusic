import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./login/authContext";
import Form from "./form/form";
import Detail from "./data/detail";
import noimage from './data/noimage.png';
import useComplete from "./alert/useComplete";
import { apiUrl } from "./const";
// import data from "./data/data";

//date formatting
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

//string formatting 
const normalizeString = (str) => {
    if (str === null || str === '') {
        return str;
    }
    let normalized = str.toLowerCase()
    normalized = normalized.replace(/[\u30A1-\u30FF]/g, (char) => {
        return String.fromCharCode(char.charCodeAt(0) - 0x60);
    });
    return normalized;
}

//main page
function Main() {
    // const musics = data;
    const today = new Date().toISOString().split('T')[0];
    const { auth } = useAuth();
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();
    const { showCompleteContent, renderDialogsComplete } = useComplete();

    //css depend on width
    const element = document.querySelector('.table');
    if (element) {
        const elementWidth = element.offsetWidth + 'px';
        document.documentElement.style.setProperty('--current-width', elementWidth);
        // console.log('elementWidth', elementWidth);
    }

    const [initialMusics, setFirstMusics] = useState([]);
    const [lists, setLists] = useState(initialMusics);
    const [form, showForm] = useState(false);
    const [detail, setDetail] = useState(false);
    const [detailedMusic, setDetailedMusic] = useState(false);
    const [flag, setFlag] = useState({ album: true, artist: true, release: true, date: true, asset: true });
    const initialFilters = { album: '', artist: '', releaseSince: '1970-01-01', releaseUntil: today, dateSince: '1970-01-01', dateUntil: today, asset: '' };
    const [filters, setFilters] = useState(initialFilters);
    const [filterIs_fav, setFilterIs_fav] = useState(false);
    const [deleteFilter, setDeleteFilter] = useState([]);

    //database connection
    useEffect(() => {
        const fetchData = async () => {
            if (auth) {
                try {
                    const response = await fetch(`${apiUrl}/api/music/user-music/${auth.username}/`);
                    const data = await response.json();
                    const formattedData = data.map(music => ({
                        ...music,
                    }));
                    setLists(formattedData);
                    setFirstMusics(formattedData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                nav('/login');
            }
        };
        fetchData();
    }, [auth, nav]);

    //array lists
    const arrayFunction = (e) => {
        setFlag((prevFlag) => ({ ...prevFlag, [e]: !prevFlag[e] }));
        const nullLists = [...lists].filter((m) => (m[e] === null) || (m[e] === ''));
        const notNullLists = [...lists].filter((m) => (m[e] !== null) && (m[e] !== ''));
        const sorted = [...notNullLists].sort((m, n) => {
            switch (e) {
                case 'album':
                    return flag[e] ?
                        n.album.localeCompare(m.album, 'ja') : m.album.localeCompare(n.album, 'ja');
                case 'artist':
                    return flag[e] ?
                        n.artist.localeCompare(m.artist, 'ja') : m.artist.localeCompare(n.artist, 'ja');
                case 'release': {
                    const releaseM = new Date(m.release);
                    const releaseN = new Date(n.release);
                    return flag[e] ? releaseN - releaseM : releaseM - releaseN;
                };
                case 'date': {
                    const dateM = new Date(m.date);
                    const dateN = new Date(n.date);
                    return flag[e] ? dateN - dateM : dateM - dateN;
                };
                case 'asset': {
                    const assetM = m.asset
                    const assetN = n.asset
                    return flag[e] ? assetN - assetM : assetM - assetN;
                };
                default:
                    throw new Error('Undefined value "[e]" !');
            }
        }).concat(nullLists);
        setLists(sorted);
    }

    //filter form onchange
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        console.log(today)
    }

    //filter lists
    const filteredLists = lists
        .filter((m) => (filterIs_fav ? m.is_fav : true))
        .filter((m) => {
            const str = normalizeString(m.album)
            const filterStr = normalizeString(filters.album)
            return (str || '').includes(filterStr || '')
        })
        .filter((m) => {
            const str = normalizeString(m.artist)
            const filterStr = normalizeString(filters.artist)
            return ((str || '').includes(filterStr || '') ||
                (str || '').includes(filterStr || ''))
        })
        .filter((m) => {
            const releaseM = new Date(m.release || false);
            const releaseE = new Date(filters.releaseSince || false);
            return releaseM >= releaseE;
        })
        .filter((m) => {
            const releaseM = new Date(m.release || false);
            const releaseE = new Date(filters.releaseUntil);
            return releaseM <= releaseE;
        })
        .filter((m) => {
            const dateM = new Date(m.date || false);
            const dateE = new Date(filters.dateSince || false);
            return dateM >= dateE;
        })
        .filter((m) => {
            const dateM = new Date(m.date || false);
            const dateE = new Date(filters.dateUntil);
            return dateM <= dateE;
        })
        .filter((m) => (m.asset ||= '') >= (filters.asset ||= ''))
        .filter((m) => {
            return !deleteFilter.some((e) => m.album === e.album && m.artist === e.artist);
        })
    const countAll = lists.length;
    const count = filteredLists.length;

    //is_fav onchange
    const toggleIs_fav = async (e) => {
        try {
            const updatedItem = {
                ...e,
                is_fav: !e.is_fav,
                asset: e.asset || null,
            };
            const updateData = {
                album: e.album,
                artist: e.artist,
                newdata: updatedItem,
            };
            await axios.patch(`${apiUrl}/api/music/user-music/${auth.username}/`,
                updateData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            updateAlbum(updateData);
        } catch (error) {
            console.error('Error toggle is_fav', error.response || error.message);
        }
    };

    //show detail page
    const showDetail = (e) => {
        setDetailedMusic(e);
        setDetail(!detail);
    }
    //addigng music from detail
    const addAlbum = (e) => {
        setLists((prev) => [
            ...prev, e
        ])
    }
    //updating music from detail
    const updateAlbum = (e) => {
        setLists(prev =>
            prev.map(item =>
                (item.album === e.album && item.artist === e.artist) ? e.newdata : item
            )
        )
        console.log('lists :', lists);
    };
    //deleting music from detail
    const deleteAlbum = (e) => {
        setDeleteFilter((prev) => [
            ...prev, e
        ])
        setDetail(!detail)
        showCompleteContent();
    }

    return (
        <>
            {loading ? <p>Loading...</p> :
                <>
                    {detail ?
                        <>
                            <Detail music={detailedMusic} lists={lists} deleteAlbum={deleteAlbum} detail={detail}
                                setDetail={setDetail} updateAlbum={updateAlbum} showDetail={showDetail} toggleIs_fav={toggleIs_fav} />
                        </> :
                        <>
                            <h2>メインページ</h2>
                            {!form ?
                                <button type="button" onClick={() => {
                                    showForm(!form)
                                }}>新規</button>
                                : <Form lists={lists} addAlbum={addAlbum} form={form} showForm={showForm} />}
                            <div className="containers">
                                <table className="table">
                                    <colgroup>
                                        <col className="col-is_fav"></col>
                                        <col className="col-image" ></col>
                                        <col className="col-album"></col>
                                        <col className="col-artist"></col>
                                        <col className="col-release"></col>
                                        <col className="col-date"></col>
                                        <col className="col-asset"></col>
                                    </colgroup>
                                    <thead className="thead">
                                        <tr>
                                            <td><button className="is_fav">該当数<br />{count}/{countAll}</button></td>
                                            <td className="image"><button onClick={() => setLists(initialMusics)}>並び替え</button></td>
                                            <td className="album"><button onClick={() => arrayFunction('album')}>アルバム</button></td>
                                            <td className="artist"><button onClick={() => arrayFunction('artist')}>アーティスト</button></td>
                                            <td className="release" ><button onClick={() => arrayFunction('release')}>リリース</button></td>
                                            <td className="date" ><button onClick={() => arrayFunction('date')}>日付</button></td>
                                            <td className="asset"><button onClick={() => arrayFunction('asset')}>評価</button></td>
                                        </tr>
                                    </thead>
                                    <tbody className="tbody">
                                        <tr className="filter">
                                            <td className="is_fav" rowSpan={2}>
                                                <button onClick={() => setFilterIs_fav(!filterIs_fav)}>
                                                    {filterIs_fav ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                        </svg>
                                                        : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                                                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                                                        </svg>}
                                                </button>
                                            </td>
                                            <td className="image" rowSpan={2}><button onClick={() => setFilters(initialFilters)}>検索</button></td>
                                            <td className="album" rowSpan={2}><input id='album' name='album' type="text" onChange={handleChange} value={filters.album} tabIndex={1} /></td>
                                            <td className="artist" rowSpan={2}><input id='artist' name='artist' type="text" onChange={handleChange} value={filters.artist} tabIndex={2} /></td>
                                            <td className="release" ><input id='releaseSince' name='releaseSince' type="date" onChange={handleChange} value={filters.releaseSince} tabIndex={3} /></td>
                                            <td className="date " ><input id='dateSince' name='dateSince' type="date" onChange={handleChange} value={filters.dateSince} tabIndex={5} /></td>
                                            <td className="asset" rowSpan={2}>
                                                <select id='asset' name='asset' type="text" onChange={handleChange} value={filters.asset} tabIndex={7}>
                                                    <option value="0">未</option>
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
                                        <tr className="filter">
                                            <td className="release" ><input id='releaseUntil' name='releaseUntil' type="date" onChange={handleChange} value={filters.releaseUntil} tabIndex={4} /></td>
                                            <td className="date" ><input id='dateUntil' name='dateUntil' type="date" onChange={handleChange} value={filters.dateUntil} tabIndex={6} /></td>
                                        </tr>
                                    </tbody>
                                    <tfoot className="tfoot">
                                        {filteredLists.map((e, index) => (
                                            <tr key={index}>
                                                <td className="is_fav">
                                                    <button type="button" onClick={() => toggleIs_fav(e)}>
                                                        {e.is_fav ?
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                            </svg>
                                                            : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                                                                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                                                            </svg>}</button>
                                                </td>
                                                <td className="image">
                                                    <button type="button" onClick={() => { showDetail(e) }}>
                                                        <img src={e.image || noimage} alt='アルバム画像' />
                                                    </button>
                                                </td>
                                                <td className="album">
                                                    <button type="button" onClick={() => { showDetail(e) }}>
                                                        {e.album}
                                                    </button>
                                                </td>
                                                <td className="artist">
                                                    <button type="button" onClick={() => { showDetail(e) }}>
                                                        {e.artist}
                                                    </button>
                                                </td>
                                                <td className="release" >
                                                    <button type="button" onClick={() => { showDetail(e) }}>
                                                        {e.release && formatDate(e.release)}
                                                    </button>
                                                </td>
                                                <td className="date" >
                                                    <button type="button" onClick={() => { showDetail(e) }}>
                                                        {e.date && formatDate(e.date)}
                                                    </button>
                                                </td>
                                                <td className="asset">
                                                    <button type="button" onClick={() => { showDetail(e) }}>
                                                        {e.asset || null}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tfoot>
                                </table>
                            </div>
                            {renderDialogsComplete()}
                        </>
                    }
                </>
            }
        </>
    )

}


export default Main;