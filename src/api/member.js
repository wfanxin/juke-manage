import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/lv/mobile/member/list',
    method: 'get',
    params: params
  })
}

export function edit(params) {
  return request({
    url: '/lv/mobile/member/edit',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/lv/mobile/member/del',
    method: 'post',
    data: params
  })
}

export function createSystemMember(params) {
  return request({
    url: '/lv/mobile/member/createSystemMember',
    method: 'post',
    data: params
  })
}

export function getTree(params) {
  return request({
    url: '/lv/mobile/member/getTree',
    method: 'get',
    params: params
  })
}
