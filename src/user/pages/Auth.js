import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { isLoading, error, sendRequest, clearError } = useHttpClient(); // 注意这里是调用 useHttpClient() 得到一个object

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          },
          image: {
            value: null,
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();
   
    if(isLoginMode){ // login 
      try{
        const responseData = await sendRequest( // 这里发送req并返回res.data. login 中主要关心的data 是 登录用户的id.
          process.env.REACT_APP_BACKEND_URL + '/users/login', 
          'POST', 
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          { // the promise resolves with an object of the built-in res class as soon as the Server responds with headers
            'Content-Type': 'application/json'
          }
        );
        auth.login(responseData.userId, responseData.token); // 仅在无err时call login, 拿到userId 和 token 数据 
      } catch (err){ // 空处理
      }
    } else{
      // 在 isLoginMode === false 下： 即为 signup
      try{
        const formData = new FormData(); // FormData 可以存放 binary data，可以用于传输图片data，这是json数据无法办到的。
        // 所以需要传输图片的时候，用它来代替json数据在frontend - backend 中的作用。
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image',formState.inputs.image.value);
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/signup', 
          'POST',
          formData
          // {'Content-Type': 'application/json'} // 有formData 之后我们不再需要header + data
          // headers + data ： 告知backend 的 use 函数，传入的req 带有附加数据，请使用这些req.data以完成对该 POST req 的处理。
        );
        auth.login(responseData.userId, responseData.token); // 仅在无err时call login 
      } catch(err){}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} /> 
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />} 
        {/* 如果isLoading就加载 LoadingSpinner component */}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide an image"/>
          )}
          {/* 添加“图像上传” component。 注意： &&（）的括号不要忘了加 */}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
          {/* sumbit button根据 Login / singup 来render，然后根据isLoginMode条件判断发送响应的 HTTP req*/}
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
        {/* 每次按下 Swich to signup/login button 的时候会 call switchModeHandler function */}
      </Card>
      <footer>
        <p>App Created by Yihu</p> 
        <p>Contact us: yihu@smu.edu</p> 
      </footer>
    </React.Fragment>
  );
};

export default Auth;
