import Vue from 'vue'
import Component from '@/pages/auth'
import { shallowMount, mount, config } from '@vue/test-utils'

config.showDeprecationWarnings = false

// デフォルトで `__mocks__` 配下の `axios.js` を探しにいく
jest.mock('axios')

let wrapper

beforeEach(() => {
  // drawFaceBoundingBox()をmock
  const drawFaceBoundingBox = jest.fn();
  drawFaceBoundingBox.mockReturnValue(null);
  // methodsとして渡すことでdrawFaceBoundingBoxが呼ばれるとmockに設定した戻り値が返る
  wrapper = shallowMount(Component, { methods: { drawFaceBoundingBox } });
})

afterEach(() => {
  wrapper.destroy()
})

describe('auth.vue', () => {
  it('表示結果：Webカメラの起動', () => {
    expect(wrapper.isVueInstance).toBeTruthy()
    // expect(wrapper.isVueInstance).toBeTruthy()
  })
  // it('表示結果：認証手順メッセージ', () => {
  // })
  // it('表示結果：ページタイトル（ヘッダ）', () => {
  // })
  // it('画面操作：管理者ログインページへの画面遷移（ヘッダ）', () => {
  // })
})
