import React, { Component } from 'react';

// import s from './PreviewModal.css';

import {
  Modal,
  Button,
} from 'antd';

const Remarkable = require('remarkable');
const md = new Remarkable();

class PreviewModal extends Component {
  render() {
    const {
      visible,
      content,
      onCancel,
      onCreate,
      onIconLoading,
    } = this.props;
    return (
      <Modal
        title="Issue 预览"
        visible={visible}
        onCancel={onCancel}
        footer={
          (
            <Button type="primary" loading={onIconLoading} onClick={onCreate}>
              创建
            </Button>
          )
        }
      >
        <div
          dangerouslySetInnerHTML={{ __html: md.render(content) }}
        ></div>
      </Modal>
    );
  }
}

export default PreviewModal;
