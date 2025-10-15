//axios的封装处理/Encapsulation and handling of Axios
import axios from "axios";
import {getToken, removeToken} from "./token";
import router from "../router";
//1.根域名配置   /Root domain configuration
//2.超时事件  /Timeout even
//3.请求拦截器/响应拦截器  /Request Interceptor/Response Interceptor

const request = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000
})

// 添加请求拦截器  /Add a request interceptor
//请求发送之前 先拦截一下 可以插入一些自定义的配置【参数的处理】/Before a request is sent, intercept it to insert some custom configurations (such as parameter handling)
request.interceptors.request.use(
    (config) => {
        //操作config 注入token数据  /Manipulate the config to inject token data
        //1获取token  /get token
        //2按照后端的格式要求做token的拼接 /Concatenate the token according to the backend's format requirements
        const token = getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 添加响应拦截器  /Add a response interceptor
//在响应返回到客户之前，做拦截，重点处理返回的数据/Intercept the response before it is returned to the client, focusing on processing the returned data.
request.interceptors.response.use(
    (response) => {
        // 2xx 范围内的状态码都会触发该函数/Status codes in the 2xx range will trigger this function
        return response.data;
    },
    (error) => {
        // 超出 2xx 范围的状态码都会触发该函数/Status codes outside the 2xx range will trigger this function
        console.dir(error)
        if (error.response.status === 401) {
            removeToken()
            router.navigate('/login')
            window.location.reload()
        }
        return Promise.reject(error);
    }
);

export {request}
