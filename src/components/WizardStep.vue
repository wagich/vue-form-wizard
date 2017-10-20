<template>
  <li :class="{'is-active': tab.active}">
    <a :class="{ 'is-disabled': isDisabled }">
      <transition :name="transition" mode="out-in">
        <div>
          <span class="tab-icon">
            <i class="icon" :class="tab.icon"></i>
          </span><br />
          <span class="tab-label">{{tab.title}}</span>
        </div>
      </transition>
    </a>
  </li>
</template>
<script>
export default {
  name: 'wizard-step',
  props: {
    tab: {
      type: Object,
      default: () => {

      }
    },
    transition: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
    },
    maxStep: {
      type: Number
    }
  },
  computed: {
    iconActiveStyle() {
      return {
        backgroundColor: this.tab.color
      }
    },
    stepCheckedStyle() {
      return {
        borderColor: this.tab.color
      }
    },
    errorStyle() {
      return {
        borderColor: this.tab.errorColor,
        backgroundColor: this.tab.errorColor
      }
    },
    stepTitleStyle() {
      let isError = this.tab.validationError
      return {
        color: isError ? this.tab.errorColor : this.tab.color
      }
    },
    isStepSquare() {
      return this.tab.shape === 'square'
    },
    isTabShape() {
      return this.tab.shape === 'tab'
    },
    isDisabled() {
      return this.index + 1 > this.maxStep;
    }
  }
}
</script>
<style>

</style>
