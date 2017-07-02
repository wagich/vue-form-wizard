import FormWizard from './components/FormWizard.js'
import TabContent from './components/TabContent.js'
export default {

  install (Vue) {
    Vue.component('form-wizard', FormWizard)
    Vue.component('tab-content', TabContent)
  }
}
