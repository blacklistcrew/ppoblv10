import axios from "axios";
import { toast } from "react-toastify";

const get = (url: string, data: {}) => {
    const res: any = axios.get(url, data)

    return res;
}

const post = async (url: string, data: any): Promise<boolean> => {
    await axios.post(url, data)
        .then(res => {
            if (res.data.success) {
                toast.success(res.data.message);
                return true;
            }

            toast.error(res.data.message);
        })
        .catch(res => {
            toast.error(res.response.data?.message);
        });

    return false;
}


const put = async (url: string, data: any): Promise<boolean> => {
    await axios.put(url, data)
        .then(res => {
            if (res.data.success) {
                toast.success(res.data.message);
                return true;
            }

            toast.error(res.data.message);
        })
        .catch(res => {
            toast.error(res.response.data?.message);
        });

    return false;
}

export default {
    get,
    post,
    put,
}
