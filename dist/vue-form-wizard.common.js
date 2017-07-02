/*!
 * vue-form-wizard v0.4.2
 * (c) 2017-present egoist <0x142857@gmail.com>
 * Released under the MIT License.
 */
'use strict';

var FormWizard = {
  props: {
    title: {
      type: String,
      default: 'Awesome Wizard'
    },
    subtitle: {
      type: String,
      default: 'Split a complicated flow in multiple steps'
    },
    nextButtonText: {
      type: String,
      default: 'Next'
    },
    backButtonText: {
      type: String,
      default: 'Back'
    },
    finishButtonText: {
      type: String,
      default: 'Finish'
    },
    hideButtons: {
      type: Boolean,
      default: false
    },
    validateOnBack: Boolean,
    /***
     * Applies to text, border and circle
     */
    color: {
      type: String,
      default: '#e74c3c'
    },
    errorColor: {
      type: String,
      default: '#8b0000'
    },
    shape: {
      type: String,
      default: 'circle'
    },
    /**
     * Name of the transition when transition between steps
     * */
    transition: {
      type: String,
      default: ''
    },
    /***
     *
     * Index of the initial tab to display
     */
    startIndex: {
      type: Number,
      default: 0,
      validator: function validator(value) {
        return value >= 0;
      }
    }
  },
  data: function data() {
    return {
      activeTabIndex: 0,
      isLastStep: false,
      currentPercentage: 0,
      maxStep: 0,
      loading: false,
      tabs: []
    };
  },

  computed: {
    tabCount: function tabCount() {
      return this.tabs.length;
    },
    displayPrevButton: function displayPrevButton() {
      return this.activeTabIndex !== 0;
    },
    stepPercentage: function stepPercentage() {
      return 1 / (this.tabCount * 2) * 100;
    },
    progressBarStyle: function progressBarStyle() {
      return {
        backgroundColor: this.color,
        width: this.progress + '%',
        color: this.color
      };
    },
    iconActiveStyle: function iconActiveStyle() {
      return {
        backgroundColor: this.color
      };
    },
    stepCheckedStyle: function stepCheckedStyle() {
      return {
        borderColor: this.color
      };
    },
    errorStyle: function errorStyle() {
      return {
        borderColor: this.errorColor,
        backgroundColor: this.errorColor
      };
    },
    stepTitleStyle: function stepTitleStyle() {
      var isError = this.tabs[this.activeTabIndex].validationError;
      return {
        color: isError ? this.errorColor : this.color
      };
    },
    isStepSquare: function isStepSquare() {
      return this.shape === 'square';
    },
    isTabShape: function isTabShape() {
      return this.shape === 'tab';
    },
    fillButtonStyle: function fillButtonStyle() {
      return {
        backgroundColor: this.color,
        borderColor: this.color,
        color: 'white'
      };
    },
    progress: function progress() {
      var percentage = 0;
      if (this.activeTabIndex > 0) {
        var stepsToAdd = 1;
        var stepMultiplier = 2;
        percentage = this.stepPercentage * (this.activeTabIndex * stepMultiplier + stepsToAdd);
      } else {
        percentage = this.stepPercentage;
      }
      return percentage;
    }
  },
  methods: {
    isChecked: function isChecked(index) {
      return index <= this.maxStep;
    },
    navigateToTab: function navigateToTab(index) {
      var _this = this;

      var validate = index > this.activeTabIndex;
      if (index <= this.maxStep) {
        var cb = function cb() {
          _this.changeTab(_this.activeTabIndex, index);
        };
        if (validate) {
          this.beforeTabChange(this.activeTabIndex, cb);
        } else {
          this.setValidationError(null);
          cb();
        }
      }
    },
    nextTab: function nextTab() {
      var _this2 = this;

      var cb = function cb() {
        if (_this2.activeTabIndex < _this2.tabCount - 1) {
          _this2.changeTab(_this2.activeTabIndex, _this2.activeTabIndex + 1);
        } else {
          _this2.isLastStep = true;
          _this2.$emit('finished');
        }
      };
      this.beforeTabChange(this.activeTabIndex, cb);
    },
    prevTab: function prevTab() {
      var _this3 = this;

      var cb = function cb() {
        if (_this3.activeTabIndex > 0) {
          _this3.setValidationError(null);
          _this3.changeTab(_this3.activeTabIndex, _this3.activeTabIndex - 1);
          _this3.isLastStep = false;
        }
      };
      if (this.validateOnBack) {
        this.beforeTabChange(this.activeTabIndex, cb);
      } else {
        cb();
      }
    },
    finish: function finish() {
      var _this4 = this;

      var cb = function cb() {
        _this4.$emit('on-complete');
      };
      this.beforeTabChange(this.activeTabIndex, cb);
    },
    setLoading: function setLoading(value) {
      this.loading = value;
      this.$emit('on-loading', value);
    },
    setValidationError: function setValidationError(error) {
      this.tabs[this.activeTabIndex].validationError = error;
      this.$emit('on-error', error);
    },
    validateBeforeChange: function validateBeforeChange(promiseFn, callback) {
      var _this5 = this;

      this.setValidationError(null);
      // we have a promise
      if (promiseFn.then && typeof promiseFn.then === 'function') {
        this.setLoading(true);
        promiseFn.then(function (res) {
          _this5.setLoading(false);
          var validationResult = res === true;
          _this5.executeBeforeChange(validationResult, callback);
        }).catch(function (error) {
          _this5.setLoading(false);
          _this5.setValidationError(error);
        });
        // we have a simple function
      } else {
        var validationResult = promiseFn === true;
        this.executeBeforeChange(validationResult, callback);
      }
    },
    executeBeforeChange: function executeBeforeChange(validationResult, callback) {
      this.$emit('on-validate', validationResult, this.activeTabIndex);
      if (validationResult) {
        callback();
      } else {
        this.tabs[this.activeTabIndex].validationError = 'error';
      }
    },
    beforeTabChange: function beforeTabChange(index, callback) {
      if (this.loading) {
        return;
      }
      var oldTab = this.tabs[index];
      if (oldTab && oldTab.beforeChange !== undefined) {
        var tabChangeRes = oldTab.beforeChange();
        this.validateBeforeChange(tabChangeRes, callback);
      } else {
        callback();
      }
    },
    changeTab: function changeTab(oldIndex, newIndex) {
      var oldTab = this.tabs[oldIndex];
      var newTab = this.tabs[newIndex];
      if (oldTab) {
        oldTab.active = false;
      }
      if (newTab) {
        newTab.active = true;
      }
      this.activeTabIndex = newIndex;
      this.checkStep();
      this.tryChangeRoute(newTab);
      this.increaseMaxStep();
      return true;
    },
    tryChangeRoute: function tryChangeRoute(tab) {
      if (this.$router && tab.route) {
        this.$router.push(tab.route);
      }
    },
    checkStep: function checkStep() {
      if (this.activeTabIndex === this.tabCount - 1) {
        this.isLastStep = true;
      } else {
        this.isLastStep = false;
      }
    },
    increaseMaxStep: function increaseMaxStep() {
      if (this.activeTabIndex > this.maxStep) {
        this.maxStep = this.activeTabIndex;
      }
    },
    checkRouteChange: function checkRouteChange(route) {
      var matchingTabIndex = -1;
      var matchingTab = this.tabs.find(function (tab, index) {
        var match = tab.route === route;
        if (match) {
          matchingTabIndex = index;
        }
        return match;
      });

      if (matchingTab && !matchingTab.active) {
        var shouldValidate = matchingTabIndex > this.activeTabIndex;
        this.navigateToTab(matchingTabIndex, shouldValidate);
      }
    },
    getTabs: function getTabs() {
      return this.$slots.default.filter(function (comp) {
        return comp.componentOptions;
      });
    },
    activateTab: function activateTab(index) {
      var tab = this.tabs[index];
      tab.active = true;
      this.tryChangeRoute(tab);
    },
    activateTabAndCheckStep: function activateTabAndCheckStep(index) {
      this.activateTab(index);
      this.checkStep();
      this.maxStep = this.startIndex;
      this.activeTabIndex = this.startIndex;
    },
    initializeTabs: function initializeTabs() {
      this.tabs = this.getTabs();
      if (this.tabs.length > 0 && this.startIndex === 0 && !this.tabs[this.activeTabIndex].active) {
        this.activateTab(this.activeTabIndex);
      }
      if (this.startIndex < this.tabs.length && this.startIndex > 0 && !this.tabs[this.startIndex].active) {
        this.activateTabAndCheckStep(this.startIndex);
      }
      if (this.startIndex >= this.tabs.length) {
        console.warn('Prop startIndex set to ' + this.startIndex + ' is greater than the number of tabs - ' + this.tabs.length + '. Make sure that the starting index is less than the number of tabs registered');
      }
    },
    reinitializeTabs: function reinitializeTabs() {
      var currentTabs = this.getTabs();
      if (this.tabs.length === 0 || this.tabs.length === currentTabs.length) return;
      this.tabs = currentTabs;
      var oldTabIndex = -1;
      this.tabs.find(function (tab, index) {
        if (tab.active) {
          oldTabIndex = index;
        }
        return tab.active;
      });
      if (oldTabIndex === -1) {
        oldTabIndex = this.activeTabIndex > 0 ? this.activeTabIndex - 1 : 0;
      }

      this.tabs.forEach(function (tab) {
        tab.active = false;
      });
      this.activateTab(oldTabIndex);
      this.maxStep = oldTabIndex;
      this.activeTabIndex = oldTabIndex;
    },
    renderTabs: function renderTabs() {
      var _this6 = this;

      var h = this.$createElement;

      return this.tabs.map(function (tab, index) {
        var _tab$componentOptions = tab.componentOptions.propsData,
            title = _tab$componentOptions.title,
            icon = _tab$componentOptions.icon;
        var active = tab.active,
            validationError = tab.validationError;

        return h(
          'li',
          { 'class': { active: active } },
          [h(
            'a',
            {
              on: {
                'click': function click() {
                  return _this6.navigateToTab(index);
                }
              }
            },
            [h(
              'div',
              { 'class': {
                  checked: _this6.isChecked(index),
                  square_shape: _this6.isStepSquare,
                  tab_shape: _this6.isTabShape,
                  'wizard-icon-circle': true
                },
                style: [_this6.isChecked(index) ? _this6.stepCheckedStyle : {}, validationError ? _this6.errorStyle : {}] },
              [h(
                'transition',
                {
                  attrs: { name: _this6.transition, mode: 'out-in' }
                },
                [active && h(
                  'div',
                  {
                    'class': { square_shape: _this6.isStepSquare, tab_shape: _this6.isTabShape, 'wizard-icon-container': true },
                    style: [active ? _this6.iconActiveStyle : {}, validationError ? _this6.errorStyle : {}] },
                  [icon && h(
                    'i',
                    { 'class': [icon, 'wizard-icon'] },
                    []
                  ), !icon && h(
                    'i',
                    { 'class': 'wizard-icon' },
                    [function () {
                      return _this6.incrementedIndex(index);
                    }, ' ']
                  )]
                )]
              ), !active && icon && h(
                'i',
                { 'class': [icon, 'wizard-icon'] },
                []
              ), !active && icon && h(
                'i',
                { 'class': 'wizard-icon' },
                [function () {
                  return _this6.incrementedIndex(index);
                }]
              )]
            ), h(
              'span',
              { 'class': { active: active, has_error: validationError, 'stepTitle': true },
                style: active ? _this6.stepTitleStyle : {} },
              [title]
            )]
          )]
        );
      });
    }
  },
  mounted: function mounted() {
    this.initializeTabs();
  },
  render: function render() {
    var h = arguments[0];

    var tabs = this.renderTabs();
    return h(
      'div',
      { 'class': 'vue-form-wizard' },
      [h(
        'div',
        { 'class': 'wizard-header' },
        [h(
          'slot',
          {
            attrs: { name: 'title' }
          },
          [h(
            'h4',
            { 'class': 'wizard-title' },
            [this.title]
          ), h(
            'p',
            { 'class': 'category' },
            [this.subtitle]
          )]
        )]
      ), h(
        'div',
        { 'class': 'wizard-navigation' },
        [h(
          'div',
          { 'class': 'wizard-progress-with-circle' },
          [h(
            'div',
            { 'class': 'wizard-progress-bar',
              style: this.progressBarStyle },
            []
          )]
        ), h(
          'ul',
          { 'class': 'wizard-nav wizard-nav-pills' },
          [tabs]
        ), h(
          'div',
          { 'class': 'wizard-tab-content' },
          [this.$slots.default]
        )]
      ), !this.hideButtons && h(
        'div',
        { 'class': 'wizard-card-footer clearfix' },
        [this.displayPrevButton && h(
          'span',
          {
            on: {
              'click': this.prevTab
            },
            'class': 'wizard-footer-left' },
          [h(
            'slot',
            {
              attrs: { name: 'prev' }
            },
            [h(
              'button',
              {
                attrs: { type: 'button',

                  disabled: this.loading },
                'class': 'wizard-btn btn-default wizard-btn-wd', style: this.fillButtonStyle },
              [this.backButtonText]
            )]
          )]
        ), this.isLastStep && h(
          'span',
          {
            on: {
              'click': this.finish
            },
            'class': 'wizard-footer-right' },
          [h(
            'slot',
            {
              attrs: { name: 'finish' }
            },
            [h(
              'button',
              {
                attrs: { type: 'button'
                },
                'class': 'wizard-btn btn-fill wizard-btn-wd btn-next',
                style: this.fillButtonStyle },
              [this.finishButtonText]
            )]
          )]
        ), !this.isLastStep && h(
          'span',
          {
            on: {
              'click': this.nextTab
            },

            'class': 'wizard-footer-right' },
          [h(
            'slot',
            {
              attrs: { name: 'next' }
            },
            [h(
              'button',
              {
                attrs: { type: 'button',

                  disabled: this.loading },
                'class': 'wizard-btn btn-fill wizard-btn-wd btn-next',
                style: this.fillButtonStyle },
              [this.nextButtonText]
            )]
          )]
        )]
      )]
    );
  },

  /***
   * Used to handle dynamic tab addition from an array since $children is not reactive
   */
  watch: {
    '$route.path': function $routePath(newRoute) {
      this.checkRouteChange(newRoute);
    }
  }
};

var TabContent = {
  name: 'tab-content',
  props: {
    title: {
      type: String,
      default: ''
    },
    /***
     * Icon name for the upper circle corresponding to the tab
     * Supports themify icons only for now.
     */
    icon: {
      type: String,
      default: ''
    },
    /***
     * Function to execute before tab switch. Return value must be boolean
     * If the return result is false, tab switch is restricted
     */
    beforeChange: {
      type: Function
    },
    route: {
      type: [String, Object]
    }
  },
  data: function data() {
    return {
      active: false,
      validationError: null
    };
  },
  render: function render() {
    var h = arguments[0];

    if (this.active) {
      return h(
        'div',
        { 'class': 'wizard-tab-container' },
        [this.$slots.default]
      );
    }
  }
};

var index = {
  install: function install(Vue) {
    Vue.component('form-wizard', FormWizard);
    Vue.component('tab-content', TabContent);
  }
};

module.exports = index;
