import React from 'react';

import s from './TokenHelpModal.css';

import tokenImg from '../../assets/token_setup.png';

import { Modal } from 'antd';

function TokenHelpModal () {
  Modal.info({
    title: '如何获取 private_token',
    width: '60%',
    content: (
      <div>
        <p>1. 点击 头像 -> Settings -> Access Tokens</p>
        <p>2. 输入 Name -> 勾选 api -> 点击 Create personal access token</p>
        <img className={s.tokenSetImg} src={tokenImg} alt="" />
      </div>
    ),
    onOk() {},
  });
}

export default TokenHelpModal;
