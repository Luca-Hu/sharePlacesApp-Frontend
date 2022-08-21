import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
// CSSTranstion component 允许运行小动画

import './SideDrawer.css';

const SideDrawer = props => {
  // 注意以下：可以把jsx element 作为常量保存
  const content = (
    <CSSTransition
      in={props.show}
      // 如果props.show为true，那么该SideDrawer即为visible
      timeout={200}
      // timeout : duration of this animation
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>
    </CSSTransition>
    //  使用CSSTransition 来包装 aside 元素
  );

  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
  // 把SideDrawer在HTML语义中放入 drawer-hook 中
};

export default SideDrawer;
