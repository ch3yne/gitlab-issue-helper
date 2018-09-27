import axios from 'axios';

// import { message } from 'antd';

axios.interceptors.request.use((config) => {
  // console.log(config);
  return config;
}, (err) => {
  // console.err(err);
  return Promise.reject(err);
});

axios.interceptors.response.use((res) => {
  return res;
}, (err) => {
  // console.error(err);
  // message.error(err.response.data.message);
  return Promise.reject(err);
});

// export default axios;

// export function getAllProjects (BASE_URL, PT_TOKEN, { PAGE = 1, PER_PAGE = 20 }) {
//   return axios.get(`${BASE_URL}/api/v4/projects`, {
//     headers: {
//       'Private-Token': `${PT_TOKEN}`
//     },
//     params: {
//       page: PAGE,
//       per_page: PER_PAGE
//     }
//   });
// }

export function getSearchProject(BASE_URL, PT_TOKEN, { KEY_WORD = '', PAGE = 1, PER_PAGE = 20 }) {
  return axios.get(`${BASE_URL}/api/v4/projects`, {
    headers: {
      'Private-Token': `${PT_TOKEN}`
    },
    params: {
      search: KEY_WORD,
      page: PAGE,
      per_page: PER_PAGE
    }
  });
}

export function searchThisProjectIssues(BASE_URL, PT_TOKEN, { REPO_ID = '', KEY_WORD = '' }) {
  return axios.get(`${BASE_URL}/api/v4/projects/${REPO_ID}/issues`, {
    headers: {
      'Private-Token': `${PT_TOKEN}`
    },
    params: {
      search: KEY_WORD,
      // page: PAGE,
      // per_page: PER_PAGE
    }
  });
}

export function postNewIssue (BASE_URL, PT_TOKEN, { REPO_ID = '', DATA = {} }) {
  return axios({
    method: 'post',
    headers: {
      'Private-Token': `${PT_TOKEN}`
    },
    url: `${BASE_URL}/api/v4/projects/${REPO_ID}/issues`,
    data: DATA,
  });
}

// export function getGroups (BASE_URL) {
//   return axios.get(`${BASE_URL}/api/v4/groups`);
// }

// export function getGroupsProjects (BASE_URL, PT_TOKEN, GROUP_ID) {
//   axios.get(`${BASE_URL}/api/v4/groups/${GROUP_ID}/projects`, {
//     headers: {
//       'Private-Token': `${PT_TOKEN}`
//     },
//   })
//   .then((res) => {
//     // console.log(res);
//     let list = [];
//     res.data.map((e) => {
//       let proj = {
//         id: e.id,
//         name: e.name,
//         name_with_namespace: e.name_with_namespace,
//       };
//       list.push(proj);
//       return list;
//     });
//     console.log(list);
//   });
// }

// export function deleteIssue (BASE_URL, PT_TOKEN, {REPO_ID = undefined, ISSUE_IID = undefined}) {
//   return axios({
//     method: 'delete',
//     headers: {
//       'Private-Token': `${PT_TOKEN}`
//     },
//     url: `${BASE_URL}/api/v4/projects/${REPO_ID}/issues/${ISSUE_IID}`,
//   });
//   // res: status: 204
// }
