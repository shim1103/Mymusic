import axios from "axios";
import { apiUrl } from "../const";

// get spotify access token
const getAccessToken = async () => {
    try {
        const response = await axios.get(`${apiUrl}/spotifyapi/refresh-token/`, {
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        const access_token = response.data.access_token;
        // console.log('getAccessToken Response:', response);
        return access_token;
    } catch (error) {
        console.error('Error refreshing token', error.response || error.message);
        throw error;
    }
};

export default getAccessToken;
