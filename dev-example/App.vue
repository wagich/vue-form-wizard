<template>
  <div>
    <button @click="removeItem()"> Remove first item</button>
    <button @click="removeEndItem()"> Remove end item</button>
    <button @click="removeCurrentItem()"> Remove current item</button>
    <button @click="addEndItem()"> Add item at end</button>
    <button @click="addFrontItem()"> Add item at front</button>
    <form-wizard ref="wizard">
      <tab-content v-for="item in arr" :title="item" :key="item"
                   icon="fa fa-user">
        My second tab contentaaaa
      </tab-content>
    </form-wizard>
  </div>
</template>

<script>
  import 'font-awesome/css/font-awesome.css'
  export default {
    name: 'app',
    data () {
      return {
        arr: ['no', 'tests', 'go', 'undone'],
        index: 1
      }
    },
    methods: {
      removeItem () {
        this.arr.shift()
      },
      removeEndItem () {
        this.arr.pop()
      },
      removeCurrentItem () {
        this.arr.splice(this.$refs.wizard.activeTabIndex, 1)
      },
      addEndItem () {
        this.arr.push('added' + this.index);
        this.index += 1;
      },
      addFrontItem () {
        this.arr.unshift('added' + this.index);
        this.index += 1;
      }
    }
  }
</script>
<style>
  @import "loader.css";
</style>
<style src="../src/assets/wizard.scss" lang="scss"></style>
<style lang="scss">
  $border-radius-extreme: 6px !default;
  $white-color: white;
  $gray-input-bg: #F3F2EE !default;
  $card-black-color: #252422 !default;

  body {
    margin-top: 20px;
    background-color: #ecf0f1;
  }

  .card-footer {
    padding: 0px 20px;
  }

  .card {
    border-radius: $border-radius-extreme;
    box-shadow: 0 2px 2px rgba(204, 197, 185, 0.5);
    background-color: $white-color;
    color: $card-black-color;
    padding: 10px 0;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
  }

</style>
