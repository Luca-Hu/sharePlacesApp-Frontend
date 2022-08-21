import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context'; // 以得到 userId，来进行重定向只该 userId 的 “MyPlaces“ page 
import './PlaceForm.css';


const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError} = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState(); // 由于要更新loadedPlaces 的数据，所以要使用useState 对 loadedPlaces 的state 进行管理
  const placeId = useParams().placeId;
  const history = useHistory(); // 以便于在前端导航中重定向至其它页面

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => { // 先使用useEffect函数来发送GET req, 拿到现有的 title和description 数据来render "update page" 中的 form state
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`);
        setLoadedPlaces(responseData.place); //更新 loadedPlaces 的state
        setFormData( // 设置表单数据
          {
            title: {
              value: responseData.place.title,
              isValid: true
            },
            description: {
              value: responseData.place.description,
              isValid: true
            }
          },
          true
        );
      } catch (error) {}
    }
    fetchPlace();
  },[sendRequest, placeId, setFormData]);

  const placeUpdateSubmitHandler = async event => { //submit 表单后触发该函数，开始更新数据（发送PATCH req）
    event.preventDefault();
    try {
      await sendRequest( // 对res.data 不关心，只需要在成功后重定向至用户的“MyPlaces”页面
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          'Content-Type' : 'application/json',
          Authorization : 'Bearer ' + auth.token
        }
      );
      history.push('/' + auth.userId + '/places');// 重定向至用户的“MyPlaces”页面，这需要导入 user.id
    } catch (error) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedPlaces && !error) { // 如果loadedPlaces为空， 那么返回渲染一个后备-fallback（应急计划）
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  } // 否则return 渲染 error / form

  return ( 
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlaces && ( // 仅在非加载状态并且有loadedPlaces 的情况下才加载 form
      <form className="place-form" onSubmit={placeUpdateSubmitHandler}> 
       {/* submit 该表单后触发 placeUpdateSubmitHandler，开始更新数据（发送PATCH req） */}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          initialValue={loadedPlaces.title}
          initialValid={true}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (min. 5 characters)."
          onInput={inputHandler}
          initialValue={loadedPlaces.description}
          initialValid={true}
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>
      )}
      <footer>
        <p>App Created by Yihu</p> 
        <p>Contact us: yihu@smu.edu</p> 
      </footer>
    </React.Fragment>
  );
};

export default UpdatePlace;
