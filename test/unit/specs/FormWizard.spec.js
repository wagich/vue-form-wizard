import Vue from 'vue'
import VueFormWizard from './../../../src/components/FormWizard.vue'
import TabContent from './../../../src/components/TabContent.vue'

function init() {
  Vue.component('form-wizard', VueFormWizard)
  Vue.component('tab-content', TabContent)
}

describe('FormWizard.vue should', () => {
  beforeEach(() => {
    init()
  })


  it('switch to prev step if current step is removed', (done) => {
    const vm = new Vue({
      template: `<form-wizard :start-index="startIndex">
                    <tab-content title="test"></tab-content>
                    <tab-content v-for="item in arr" :title="item" :key="item"
                                 icon="ti-settings">
                      Content
                    </tab-content>
                </form-wizard>`,
      data: {
        arr: ['no', 'tests', 'go', 'undone'],
        index: 1,
        startIndex: 1
      }
    }).$mount()

    var wizard = vm.$children[0];
    console.log('check', wizard.activeTabIndex)
    //remove current step
    vm.arr.splice(vm.startIndex, 1)
    setTimeout(() => {
      wizard = vm.$children[0];
      console.log('check', wizard.activeTabIndex)
      expect(wizard.activeTabIndex).to.equal(1)
      done()
    }, 1000)
  })
})
