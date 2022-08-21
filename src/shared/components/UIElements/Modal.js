import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';
import './Modal.css';

const ModalOverlay = props => {
  // 模态的覆盖层：可视部分
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : event => event.preventDefault()
        }
        // 取保不会因重新加载而意外自动触发submit请求
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
          {/* props.children： jsx的开头和结束标签之间的所有元素 */}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

const Modal = props => {
  // 模态的背景backdrop，以及显示动画
  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      {/* Backdrop: 点击背景即取消 */}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <ModalOverlay {...props} />
        {/* 把 ModalOverlay component 放在 Modal component 中。 通过Modal 对 ModalOverlay 进行更改： 
        这是一个spread operation，它接受props对象的所有键值对并将它们作为属性展开到 ModelOverlay 上*/}
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
