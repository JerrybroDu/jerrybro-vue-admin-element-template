import request from '@/utils/request'

export function getList() {
  return request({
    url: '/booktown/book/getAllBook',
    method: 'get'
  })
}

export function getListByName(params) {
  return request({
    url: `/booktown/book/name/${params}`,
    method: 'get'
  })
}

export function getListById(params) {
  return request({
    url: `/booktown/book/${params}`,
    method: 'get'
  })
}

export function deleteById(params) {
  return request({
    url: `/booktown/book/${params}`,
    method: 'delete'
  })
}

export function updateBookById(params) {
  return request({
    url: `/booktown/book/${params}`,
    method: 'put'
  })
}

export function addBook(data) {
  return request({
    url: '/booktown/book/5',
    method: 'post',
    data
  })
}
