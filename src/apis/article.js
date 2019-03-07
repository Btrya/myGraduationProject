import axios from 'axios';
import baseUrl from './config.js'
// var baseUrl = process.env.BASE_API;
const urls = {
  publish: '/article/publish',
  getIndexArticle: '/article/getIndexArticle',
  getArticleById: '/article/getArticleById',
  getArticle: '/article/getArticle',
  update: '/article/update',
  deleteById: '/article/deleteById'
}
// 合并请求链接
const apis = Object.keys(urls)
  .reduce((acc, url) => {
    acc[url] = baseUrl + urls[url];
    return acc;
  }, {});

// 发布
export const publish = (query) => {
  return axios({
    url: apis.publish,
    method: 'post',
    data: query
  })
};

// 首页获取文章数据
export const getIndexArticle = () => {
  return axios({
    url: apis.getIndexArticle,
    method: 'get'
  })
};

// 根据文章id获取文章
export const getArticleById = (query) => {
  return axios({
    url: apis.getArticleById,
    method: 'post',
    data: query
  })
};

// 根据条件分页获取数据
export const getArticle = (query) => {
  return axios({
    url: apis.getArticle,
    method: 'post',
    data: query
  })
};

// 根据条件分页获取数据
export const update = (query) => {
  return axios({
    url: apis.update,
    method: 'post',
    data: query
  })
};

// 根据id删除文章
export const deleteById = (query) => {
  return axios({
    url: apis.deleteById,
    method: 'post',
    data: query
  })
};
