import React, { Component } from 'react';

import { Form, Input } from 'antd';

const FormItem = Form.Item;

const { TextArea } = Input;

class BugForm extends Component {
  render() {
    const { formItemLayout } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <FormItem
          {...formItemLayout}
          label="环境："
          help="系统版本、浏览器版本等等信息(e.g. OS: Windows 10, Browser: Chrome 68.0.3440.106)"
          hasFeedback
        >
          {
            getFieldDecorator('env', {
              rules: [
                { required: true, message: '请填写你的当前环境!' },
              ],
            })(
              <Input placeholder="" />
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="问题描述："
          help="该问题是怎么引起的？可以使用 Markdown 语法。"
          hasFeedback
        >
          {
            getFieldDecorator('bugDesc', {
              rules: [
                { required: true, message: '请填写描述信息!' },
              ],
            })(
              <TextArea autosize={{ minRows: 2 }} />
            )
          }
        </FormItem>
      </div>
    );
  }
}

const WrappedBugForm = Form.create()(BugForm);

export default WrappedBugForm;
