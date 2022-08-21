import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

const NewPlace = () => {
  const auth = useContext(AuthContext); // 从AuthContext 中拿取登录者 id
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm( 
    // 使用Reducer 验证表单内是否所有input都isValid。如果有一个不合理，那么submit button将被禁用
    // 此处为useForm 的初始化
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }, 
      address: {
        value: '', 
        isValid: false
      },
      image:{
        value: null,
        isValid: false
      }
    },
    false
  );

  const history = useHistory(); // useHistory hook : 用于创建一个“历史对象”

  const placeSubmitHandler = async event => {
    event.preventDefault();
    // 保证页面中的表单没有在默认情况下就被提交
    try { // 确保在未出错的情况下运行 sendRequest 函数
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      // formData.append('creator',auth.userId); // 把登录者userId 传入 backend //作为改进，后端已经使用Browser的 userData中的 userId，所以我们不再需要从前端传回 userId
      formData.append('image', formState.inputs.image.value);
      await sendRequest( // add new place , 不需要关心 backend 发来的数据，不做存储。
        process.env.REACT_APP_BACKEND_URL + '/places',  // inject env var to js file
        'POST', 
        formData,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      history.push('/'); // “历史对象”允许你通过将新页面添加在堆栈上来替换当前页面转到新页面。
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {/* 显示“error 弹窗”组件 */}
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay/>}
        {/* 显示“Loading 等待”组件 */}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide an image."/>
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
      <footer>
        <p>App Created by Yihu</p> 
        <p>Contact us: yihu@smu.edu</p> 
      </footer>
    </React.Fragment>
  );
};

export default NewPlace;
