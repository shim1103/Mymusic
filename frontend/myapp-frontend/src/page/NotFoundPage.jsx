import { useNavigate, useParams } from "react-router-dom";

//Not any link page
function NotFoundPage() {
    const { '*': paths } = useParams();
    const nav = useNavigate();
    const handleClick = () => nav('/');

    return (
        <>
            <p>存在しないページ「{paths}」</p>
            <button onClick={handleClick}>OK</button>
        </>
    )
}

export default NotFoundPage;