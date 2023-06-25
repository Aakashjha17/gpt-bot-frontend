import axios from 'axios'

const url = 'https://gotbotbackend.onrender.com/api'

export const PostData = (data) => axios.post(`${url}/postData`,data);
