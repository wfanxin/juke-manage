import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/lv/mobile/config/list',
    method: 'get',
    params: params
  })
}

export function saveConfig(params) {
  return request({
    url: '/lv/mobile/config/saveConfig',
    method: 'post',
    data: params
  })
}
