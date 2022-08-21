import React from 'react';
import { Link } from 'react-router-dom';
// Link component 实际是对一个 anchor attack-锚标记<a> 进行包装和渲染，

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import './UserItem.css';
// 这些 UI components 是老师提供的

const UserItem = props => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        {/*  content : 包括image + info。 Card 组件允许传入一个prop 对自己内部的div-className直接进行更新 */}
        <Link to={`/${props.id}/places`}>
          {/* Link 是个动态路径，使用动态字符串` ${} ` */}
          <div className="user-item__image">
            <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
