import React, { Component } from 'react';

// import s from './SetupModal.css';

import TokenHelpModal from '../TokenHelpModal';

import {
  Modal,
  Form,
  Input,
  // Button
} from 'antd';

const FormItem = Form.Item;

class SetupModal extends Component {
  render() {
    const {
      visible,
      formItemLayout,
      setupBtnOnClick,
      setupBtnOncancel,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const setTokenHelpText = (
      <div><a onClick={TokenHelpModal}>如何设置？</a></div>
    );
    return (
      <Modal
        title="token设置"
        closable={false}
        keyboard={false}
        maskClosable={false}
        visible={visible}
        onOk={setupBtnOnClick}
        onCancel={setupBtnOncancel}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="网址："
          >
            {
              getFieldDecorator('siteValue', {
                initialValue: 'https://gitlab.com',
              })(
                <Input />
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="private_token："
            help={setTokenHelpText}
          >
            {
              getFieldDecorator('tokenValue', {
                initialValue: '',
              })(
                <Input />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default SetupModal;
