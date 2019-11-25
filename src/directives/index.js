import Vue from 'vue';
// 自定义滚动条
import PerfectScrollbar from 'perfect-scrollbar';
// 对应的css
import "perfect-scrollbar/css/perfect-scrollbar.css";

/**
 * @description 为自定义滚动条全局注入自定义指令。自动判断该更新PerfectScrollbar还是创建它
 * @param {Element} el - 必填。dom元素
 */
const el_scrollBar = (el) => {
  // 在元素上加点私货，名字随便取，确保不会和已有属性重复即可，我取名叫做_ps_
  if (el._ps_ instanceof PerfectScrollbar) {
    el._ps_.update();
  } else {
    // el上挂一份属性
    el._ps_ = new PerfectScrollbar(el, { suppressScrollX: true });
  }
};

Vue.directive("myScroll", {
  inserted (el, binding) {
    const { arg } = binding;
    if (arg === "table") {
      el = el.querySelector(".el-table__body-wrapper");
      if (!el) {
        return console.warn("未发现className为el-table__body-wrapper的dom");
      }
    }
    const rules = ["fixed", "absolute", "relative"];
    if (!rules.includes(window.getComputedStyle(el, null).position)) {
      console.error(`perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join("、")}`)
    }
    el_scrollBar(el);
  },
  componentUpdated (el, binding, vnode) {
    const { arg } = binding;
    if (arg === "table") {
      el = el.querySelector(".el-table__body-wrapper");
      if (!el) {
        return console.warn("未发现className为el-table__body-wrapper的dom");
      }
    }
    vnode.context.$nextTick(
      () => {
        try {
          el_scrollBar(el);
        } catch (error) {
          console.error(error);
        }
      }
    )
  }
})
