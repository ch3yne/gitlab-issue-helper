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
          label="功能描述："
          help="例如：需要用到的场景。可以使用 Markdown 语法。"
          hasFeedback
        >
          {
            getFieldDecorator('futureDesc', {
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
