import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient  } from '../../shared/hooks/http-hook';

const Users = () => {
  // 我们希望每次users page 加载的时候，都自动发送一个HTTP GET req（而不需要靠button触发函数），使用fetch可以完成 send GET req->加载页面。
  // 但不希望每次page 内部的任何data更新导致的 component 的re-render 也会触发“发送GET req”，因为如果每次res返回不同的data，那么将会导致无限循环。
  // 因此使用 useEffect hook，它允许我们仅在特定的dependency component re-render后才触发 “发送GET req”
  const [loadedUsers, setLoadedUsers] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttpClient(); // 注意这里是调用 useHttpClient() 得到一个object

  useEffect(() => {
    const fetchUsers = async () => {

      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users'); 
        // fetch函数的default req type is a GET req， 所以这里不用在fetch函数加 Method。 另外，我们也不需要添加内容类型headers，因为我们不需要在req上附加任何数据，backend 处理 GET req 不需要任何附加数据。
        // 此处我们则需要对 res.data 进行处理！所以使用const 来接收data 。  
      
        setLoadedUsers(responseData.users); // 在backend 发送来的res.data中，是一个有key-value的users数组
      } catch (err) {}
    };
    fetchUsers();  // 此处虽然sendRequest 使用了async, 但我们实际需要它立即处理该函数（因为加载需要），如果为了安全强行使用async，不能在useEffect上使用，只能在useEffect之中新建一个 async function 并立即调用. 
  },[sendRequest]); // useEffect 第2个参数就是 dependency components 数组，也就是真正需要为其re-render而重新加载整个页面的components. 如果该数组为空， 那么useEffect函数只会run一次，也就是说fetch也只会run一次，也就是该页面将只会加载一次

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
      {/* Users 页面上展示 UsersList。 items: prop item 。 
      !isLoading && loadedUsers： 仅在"我们有用户的时候"会才render UsersList */}
      <footer>
        <p>App Created by Yihu</p> 
        <p>Contact us: yihu@smu.edu</p> 
      </footer>
    </React.Fragment>
  );
};

export default Users;
