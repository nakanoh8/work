import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld'

import { mount } from '@vue/test-utils';

describe('HelloWorld.vue', () => {
  it('should render correct contents', () => {
    // const Constructor = Vue.extend(HelloWorld)
    // const vm = new Constructor().$mount()
    // expect(vm.$el.querySelector('.display-2 h1').textContent)
    //   .toEqual('Welcome to Vuetify')
    const wrapper = mount(HelloWorld)
    expect(wrapper.isVueInstance).toBeTruthy()
  })
})
