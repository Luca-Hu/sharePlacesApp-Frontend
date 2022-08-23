import React, { useEffect , useState } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceForm.css';

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();

  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  // const auth = useContext(AuthContext); // 从AuthContext 中拿取登录者 id 
  //  debug: userplaces 不止是拜访登录者自己的places，而可以是浏览其他人的places，此时只能从url中“userParams”取userId，而不能从“authContext”（仅有登录者自己）中取

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async() => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
        setLoadedPlaces(responseData.places); // 从Backend 得到的数据为： 一个带places key 的对象
        console.log(responseData.places);
      } catch (error) {}
    }; // 使用fetchPlaces把 sendRequest 包装为一个异步函数，因为useEffect 不是
    fetchPlaces();
  }, [sendRequest, userId]); // useEffect： dependency只会被创建一次，此后不变。仅在第一次render的时候，useEffect中的sendRequest才被调用一次，后续的re-render时，sendRequest将不再被调用。也即：req最多只发送一次。
  // 把userId 也作为 dependency， 因为网页的URL 不会改变
  
  const placeDeletedHandler = deletedPlaceId => { // 返回过滤掉被删除的place 的places
    setLoadedPlaces(prevPlaces =>
       prevPlaces.filter(place => place.id !== deletedPlaceId)
    );
  };

  return (
  <React.Fragment>
    <ErrorModal error={error} onClear={clearError} />
    {isLoading && (
      <div className="center">
        <LoadingSpinner />
      </div>
    )}
    {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler}/> };
    {/* 仅在有places 的时候才加载 PlaceList */}
    <footer>
        <p>App Created by Yihu</p> 
        <p>Contact us: yihu@smu.edu</p> 
    </footer>
  </React.Fragment>
  
  );
};

export default UserPlaces;
