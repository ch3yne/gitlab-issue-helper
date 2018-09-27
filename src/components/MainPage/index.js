import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import s from './MainPage.css';

import BugForm from '../BugFrom';
import FeatureForm from '../FeatureForm';
import SetupModal from '../SetupModal';
import PreviewModal from '../PreviewModal';

import * as api from '../../api';

import logo from '../../assets/gitlab-logo.svg';

import {
  Layout,
  Row,
  Col,
  Select,
  Button,
  Form,
  Input,
  // Pagination,
  // Spin,
  // Icon,
  message,
  notification,
} from 'antd';

const { Header, Footer, Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
// const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

// const formItemLayout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 5 },
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 12 },
//   },
// };

// const storage = JSON.parse(localStorage.getItem('storage'));
// console.log(storage);

let timeout;

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storage: null,
      projectList: [],
      issueType: 'bug',
      setupVisible: false,
      // loadingRepos: false,
      // xTotal: 1,
      previewVisible: false,
      similarIssues: [],
      iconLoading: false,
    };
  }
  componentDidMount() {
    const storage = JSON.parse(localStorage.getItem('storage'));
    if (storage === null) {
      this.setState({
        setupVisible: true,
      });
    }
    this.setState({
      storage: storage,
    });
    // this.initAllRepos(storage, {});
  }

  fetchProject = (value, callback) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    this.getData = (value) => {
      const { storage } = this.state;
      api.getSearchProject(storage.site, storage.token, {
        KEY_WORD: value,
      })
        .then((res) => {
          // console.log(res);
          let list = [];
          res.data.map((e) => {
            let proj = {
              id: e.id,
              name_with_namespace: e.name_with_namespace,
            };
            list.push(proj);
            return list;
          });
          // this.setState({
          //   projectList: list,
          // });
          callback(list);
        })
        .catch((err) => {
          console.error(err);
        });
    }
    timeout = setTimeout(() => {
      this.getData(value);
    }, 500);
  }

  handleSetup = (val) => {
    const { getFieldValue }= this.props.form; 
    switch (val) {
      case 'confirm':
        let stg = {
          site: getFieldValue('siteValue'),
          token: getFieldValue('tokenValue'),
        };
        // console.log(stg);
        localStorage.setItem('storage', JSON.stringify(stg));
        this.setState({
          setupVisible: false,
          storage: stg,
        });
        // this.initAllRepos(stg, {});
        break;
      default:
        if (localStorage.getItem('storage') === null) {
          let stg = {
            site: 'https://gitlab.com',
            token: '',
          };
          localStorage.setItem('storage', JSON.stringify(stg));
          this.setState({
            storage: stg,
          });
        }
        this.setState({
          setupVisible: false,
        });
        break;
    }
  }

  handlePreview = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        this.setState({
          previewVisible: true,
        });
      }
    });
  }

  handleClosePreview = () => {
    this.setState({
      previewVisible: false,
    });
  }

  // initAllRepos = (storage, { X_PAGE = 1 }) => {
  //   this.setState({
  //     loadingRepos: true,
  //     projectList: [],
  //   });
  //   api.getAllProjects(storage.site, storage.token, { PAGE: X_PAGE })
  //     .then((res) => {
  //       console.log(res);
  //       let list = [];
  //       res.data.map((e) => {
  //         let proj = {
  //           id: e.id,
  //           // name: e.name,
  //           name_with_namespace: e.name_with_namespace,
  //         };
  //         list.push(proj);
  //         return list;
  //       });
  //       this.setState({
  //         projectList: list,
  //         loadingRepos: false,
  //         xTotal: parseInt(res.headers['x-total'], 10),
  //       });
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       this.setState({
  //         loadingRepos: false,
  //       });
  //     });
  // }

  handleSearch = (value) => {
    this.fetchProject(value, data => this.setState({projectList: data}));
  }

  handleCreate = () => {
    const { form } = this.props;
    const title = form.getFieldValue('issueTitle');
    const { issueType, storage } = this.state;
    const repo = form.getFieldValue('selectRepo');
    const desc = `${this.getContent(issueType)}\n\n<!-- generated by gitlab-issue-helper. DO NOT REMOVE -->`;
    this.setState({
      iconLoading: true,
    });
    api.postNewIssue(storage.site, storage.token, {
      REPO_ID: repo,
      DATA: {
        title: title,
        description: desc,
        labels: issueType === 'feature' ? 'feature' : '',
      }
    })
      .then((res) => {
        // console.log(res);
        this.setState({
          iconLoading: false,
        });
        switch (res.status) {
          case 201:
            this.setState({
              previewVisible: false,
            });
            // message.success(`${'创建成功'}`);
            notification['success']({
              duration: null,
              message: 'issue 提交成功',
              description: (<p>链接地址： <a href={res.data.web_url} target="_blank">{res.data.web_url}</a></p>),
            });
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        console.error(err);
        message.error(err.response.data.message);
        this.setState({
          iconLoading: false,
        });
      });
  }

  InitIssues = (repo) => {
    const { storage } = this.state;
    const { form } = this.props;
    const title = form.getFieldValue('issueTitle');
    if (title) {
      api.searchThisProjectIssues(storage.site, storage.token, { REPO_ID: repo, KEY_WORD: title })
        .then((res) => {
          // console.log(res);
          this.setState({
            similarIssues: res.data,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      this.setState({
        similarIssues: [],
      });
    }
  }

  handleTitleBlur = () => {
    const { form } = this.props;
    const repo = form.getFieldValue('selectRepo');
    this.InitIssues(repo);
  }

  handleChangeRepo = (e) => {
    // console.log(e);
    this.InitIssues(e);
  }

  handleChangeType = (e) => {
    // console.log(e);
    this.setState({
      issueType: e,
    });
  }

  // handleChangePage = (e) => {
  //   const { storage } = this.state;
  //   // console.log(e);
  //   this.initAllRepos(storage, { X_PAGE: e });
  // }

  setupBtnClick = () => {
    this.setState({
      setupVisible: true,
    });
  }

  createPreview = (issueType, values) => {
    // if (issueType === 'bug') {
    //   return this.createBugPreview(values);
    // }
    // return this.createFeaturePreview(values);
    return issueType === 'bug' ? this.createBugPreview(values) : this.createFeaturePreview(values);
  }

  createBugPreview = ({
    env,
    bugDesc,
    issueExtra,
  }) => {
    return `
### Environment
${env}

### Description
${bugDesc}

${issueExtra ? `---\n${issueExtra}` : ''}
`.trim();
      }

  createFeaturePreview = ({
    futureDesc,
    issueExtra,
  }) => {
    return `
### Description
${futureDesc}

${issueExtra ? `---\n${issueExtra}` : ''}
`.trim();
  }

  getContent = (issueType) => {
    return this.createPreview(issueType, this.props.form.getFieldsValue());
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { setupVisible, previewVisible, issueType, similarIssues, iconLoading } = this.state;
    const content = this.getContent(issueType);
    const similarIssuesList = (
      <FormItem>
        <h3>相关 Issues:</h3>
        <ul>
          {similarIssues.map(issue =>
            <li key={issue.id}>
              <a href={issue.web_url} target="_blank" rel="noreferer noopener">
                {issue.title}
              </a>
            </li>,
          )}
        </ul>
      </FormItem>
    );

    return (
      <Layout className={s.layout}>
        <PreviewModal
          visible={previewVisible}
          content={content}
          onCancel={this.handleClosePreview}
          onCreate={this.handleCreate}
          onIconLoading={iconLoading}
        />
        <SetupModal
          // formItemLayout={formItemLayout}
          form={form}
          visible={setupVisible}
          setupBtnOnClick={this.handleSetup.bind(this, 'confirm')}
          setupBtnOncancel={this.handleSetup}
        />
        <Header className={s.header}>
          <Row>
            <Col span={18}>
              <img src={logo} alt="" />
              <span className={s.headerTitle}>GitLab Issue Helper</span>
            </Col>
            <Col span={6} className={s.headRight}>
              <Button
                className={s.setBtn}
                shape="circle"
                icon="setting"
                ghost
                onClick={this.setupBtnClick}
              />
            </Col>
          </Row>
        </Header>
        <Content className={s.content}>
          <Scrollbars>
            <div className={s.container}>
              <Form>
                <FormItem />
                <FormItem
                  // {...formItemLayout}
                  label="gitlab仓库："
                  help={(
                    <div>
                      <span>请确保将 issue 发往相关的仓库。</span>
                      {
                        /*
                        <Spin
                        indicator={antIcon}
                        spinning={this.state.loadingRepos}
                      >
                        <Pagination
                          className={s.pagination}
                          onChange={this.handleChangePage}
                          hideOnSinglePage={true}
                          simple
                          defaultPageSize={100}
                          defaultCurrent={1}
                          total={this.state.xTotal}
                        />
                      </Spin>
                        */
                      }
                    </div>
                  )}
                  hasFeedback
                >
                  {
                    getFieldDecorator('selectRepo', {
                      rules: [
                        { required: true, message: '请选择对应的项目!' },
                      ],
                    })(
                      // <Select
                      //   showSearch
                      //   placeholder={this.state.loadingRepos ? '加载中...' : '请选择对应的项目'}
                      //   optionFilterProp="children"
                      //   filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      //   onChange={this.handleChangeRepo}
                      // >
                      <Select
                        showSearch
                        placeholder={'请选择对应的项目'}
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        onSearch={this.handleSearch}
                        onChange={this.handleChangeRepo}
                        notFoundContent={null}
                      >
                        {this.state.projectList.map((e, i) => {
                          return (
                            <Option key={i} value={e.id}>{e.name_with_namespace}</Option>
                          );
                        })}
                      </Select>
                    )
                  }
                </FormItem>
                <FormItem
                  // {...formItemLayout}
                  label="issue类型："
                >
                  <Select
                    className={s.select}
                    defaultValue="bug"
                    onChange={this.handleChangeType}
                  >
                    <Option value="bug">错误报告</Option>
                    <Option value="feature">功能需求</Option>
                  </Select>
                </FormItem>
                <FormItem
                  // {...formItemLayout}
                  label="issue标题："
                  hasFeedback
                >
                  {
                    getFieldDecorator('issueTitle', {
                      rules: [
                        { required: true, message: '请填写issue的标题!' },
                      ],
                    })(
                      <Input onBlur={this.handleTitleBlur} placeholder="" />
                    )
                  }
                </FormItem>
                {similarIssues.length > 0 && similarIssuesList}
                <FormItem>
                  {(
                    () => {
                      switch (this.state.issueType) {
                        case 'bug':
                          return <BugForm form={form} />;
                        case 'feature':
                          return <FeatureForm form={form} />;
                        default:
                          return null;
                      }
                    }
                  )()}
                </FormItem>
                <FormItem
                  // {...formItemLayout}
                  label="补充说明（可选）："
                  help="可以使用 Markdown 语法。"
                >
                  {
                    getFieldDecorator('issueExtra')(
                      <TextArea autosize={{ minRows: 2 }} />
                    )
                  }
                </FormItem>
              </Form>
              <div className={s.preViewBtnContainer}>
                <Button type="primary" size="large" onClick={this.handlePreview}>预览</Button>
              </div>
            </div>
          </Scrollbars>
        </Content>
        <Footer className={s.footer}>
          
        </Footer>
      </Layout>
    )
  }
}

const WrappedMainPage = Form.create()(MainPage);

export default WrappedMainPage;
