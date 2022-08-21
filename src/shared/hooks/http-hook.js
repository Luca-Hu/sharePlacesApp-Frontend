import { useState, useCallback, useRef, useEffect } from 'react';

// 该hook 用于管理 向backend 发送 req.data ，并fetch 接收 res.data 。 整体逻辑的代码。
export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]); // useRef hook： 将其转化为 ref . 当这个useHtttpClient 函数再次运行时，它不会被重新初始化，并且每次使用该 hook 的component re-render时，这个函数就回再次运行

    const sendRequest = useCallback( async (url, method = 'GET', body = null, headers = {}) => { // 创建sendRequest （这是一个async function）
        setIsLoading(true);
        const httpAbortCtrl = new AbortController(); // 为http.req 设置一个中断控制器：httpAbortCtrl
        activeHttpRequests.current.push(httpAbortCtrl); 

        try{
            const response = await fetch(url, {
            method, // method: method,
            body,
            headers,
            signal: httpAbortCtrl.signal // 这将支持控制器和此req相连接，现在我们可以使用控制器来取消此连接请求
          });

            const responseData = await response.json();
            // 拿到从Server返回的解析为 json 格式的 res data。我们需要检查这个data中是否有400/500 state code error

            activeHttpRequests.current = activeHttpRequests.current.filter( reqCtrl => reqCtrl !== httpAbortCtrl ); // 过滤掉负责此特定请求的特定控制器, 完成后我们将清理完所有旧的已经完成请求的reqCtrl 中断控制器

            if(!response.ok){ // ok 不包括 400/500 state code。 Debug ：注意 是检验的是 response 而不是 responseData ！  
                throw new Error(responseData.message);
            }
            setIsLoading(false);
            return responseData;
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            throw err;
        }  
    },[]); // useCallback function: 当使用该 http-hook 的component 自己re-render 的时候，该sendRequest 函数不会被 re-create。 依赖项为空数组

    const clearError = () => { // 重置 error state 的函数， 一同放在该 http-hook component 中，可以从 import该component 后调用。
        setError(null);
    }

    useEffect(()=> { // chearup function 清除函数。 
        return () => {
            // activeHttpRequests.current： 终止控制器的数组
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort()); // 每个终止控制器都会调用一次中止，这会阻止发送Http.req
        };
    },[]);

    return { isLoading, error, sendRequest, clearError};
    // isLoading: isLoading, 
};