// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { useWaline, useLive2d } from '@davidingplus/vitepress-waline-live2d'
import { useRoute } from 'vitepress'
import './style.css'

import BackToTopButton from '@davidingplus/vitepress-back-to-top-button'
import '@davidingplus/vitepress-back-to-top-button/style.css'

import ImageViewerP from '@davidingplus/vitepress-image-viewer'
import '@davidingplus/vitepress-image-viewer/style.css'

import VPSwiper from '@cssnr/vitepress-swiper'
import '@cssnr/vitepress-swiper/style.css'


export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp(ctx) {
    BackToTopButton(ctx.app)
    ImageViewerP(ctx.app)
    ctx.app.component('VPSwiper', VPSwiper)
  },
  setup() {
    useWaline({
      serverURL: 'https://waline.davidingplus.cn',
      vitepressUseRoute: useRoute
    })
    useLive2d({
      vitepressUseRoute: useRoute,
      enable: true,
      model: {
        url: 'https://cdn.davidingplus.cn/files/vscode-live2d-model-library/wanko/wanko.model.json'
      },
      display: {
        position: 'right',
        width: '135px',
        height: '300px',
        xOffset: '35px',
        yOffset: '5px'
      },
      mobile: {
        show: true
      },
      react: {
        opacity: 0.8
      }
    })
  }
} satisfies Theme
