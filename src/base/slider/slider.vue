<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot>
            </slot>
        </div>
        <div class="dots">
            <span class="dot" v-for="(item, index) in dots" :class="{active: currentPageIndex === index}" :key="index"></span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'
export default {
  name: 'slider',
  props: {
    loop: {// 是否无缝切换
      type: Boolean,
      default: true
    },
    autoPlay: { // 是否自动轮播
      tyoe: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },

  // 保证dom成功渲染，浏览器的刷新通常是17ms一次
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    // 窗口改变 重新计算宽度
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    _setSliderWidth(resize) {
      // 整个列表多少个元素
      this.children = this.$refs.sliderGroup.children
      let width = 0
      // 获取父容器的宽度
      const sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i]
        addClass(child, 'slider-item')
        // 每个子元素宽度都等于父元素宽度
        child.style.width = sliderWidth + 'px'
        // 累加总宽度
        width += sliderWidth
      }

      // 如果无缝切换 就需要多加两个宽度的dom
      if (this.loop && !resize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    // 初始化
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true, // 左右滑动
        scrollY: false, // 禁止上下滑动
        momentum: false, // 惯性
        click: true,
        snap: {
          loop: true,
          threshold: 0.3,
          // snapLoop: this.loop, // 循环
          speed: 400
        }
      })

      this.slider.on('scrollEnd', () => {
        const pageIndex = this.slider.getCurrentPage().pageX

        this.currentPageIndex = pageIndex

        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _play() {
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  },
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.slider {
    min-height: 1px;

    .slider-group {
        position: relative;
        overflow: hidden;
        white-space: nowrap;

        .slider-item {
            float: left;
            box-sizing: border-box;
            overflow: hidden;
            text-align: center;

            a {
                display: block;
                width: 100%;
                overflow: hidden;
                text-decoration: none;
            }

            img {
                display: block;
                width: 100%;
            }
        }
    }

    .dots {
        position: absolute;
        right: 0;
        left: 0;
        bottom: 12px;
        text-align: center;
        font-size: 0;

        .dot {
            display: inline-block;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;

            &.active {
                width: 20px;
                border-radius: 5px;
                background: $color-text-ll;
            }
        }
    }
}
</style>