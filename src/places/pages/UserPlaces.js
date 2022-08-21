import React, { useEffect , useState ,useContext} from 'react';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

import { AuthContext } from '../../shared/context/auth-context';

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();

  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  const auth = useContext(AuthContext); // 从AuthContext 中拿取登录者 id

  useEffect(() => {
    const fetchPlaces = async() => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/places/user/${auth.userId}`);
        setLoadedPlaces(responseData.places); // 从Backend 得到的数据为： 一个带places key 的对象
        console.log(responseData.places);
      } catch (error) {}
    }; // 使用fetchPlaces把 sendRequest 包装为一个异步函数，因为useEffect 不是
    fetchPlaces();
  }, [sendRequest, auth.userId]); // useEffect： dependency只会被创建一次，此后不变。仅在第一次render的时候，useEffect中的sendRequest才被调用一次，后续的re-render时，sendRequest将不再被调用。也即：req最多只发送一次。
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
