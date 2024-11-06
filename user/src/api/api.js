import axios from "axios";
const local = process.env.REACT_APP_SERVER_URL

const api = axios.create({
    baseURL : `${local}/api`
})

export default api