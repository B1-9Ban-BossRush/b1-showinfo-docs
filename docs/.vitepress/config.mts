import {
  defineConfig,
  resolveSiteDataByRoute,
  type HeadConfig
} from 'vitepress'

import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { fileURLToPath, URL } from 'node:url'

import llmstxt from 'vitepress-plugin-llms'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "实时关键数据显示 MOD 手册",
  description: "黑神话悟空 实时关键数据显示 MOD 手册",

  metaChunk: true,

  markdown: {
    config(md) {
      md.use(groupIconMdPlugin, {
        titleBar: {
          includeSnippet: true,
        },
      })
    },
  },

  head: [
    [
      'link',
      { rel: 'icon', type: 'image/svg+xml', href: '/assets/logo.svg' }
    ],
    [
      'link',
      { rel: 'icon', type: 'image/png', href: '/assets/logo.png' }
    ],
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'B1 ShowInfo Docs' }],
    ['meta', { property: 'og:url', content: 'https://b1.davidingplus.cn/' }],
    ['script', { src: '/live2d.js' }]
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: { src: '/assets/logo.svg', width: 24, height: 24 },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/DavidingPlus/b1-showinfo-docs' }
    ],

    search: {
      provider: 'local',
      options: {
        searchOptions: {
          detailedView: true
        }
      }
    },

    footer: {
      message: '<a href="https://beian.miit.gov.cn/">蜀 ICP 备 2024088070 号</a>',
      copyright: 'Copyright © 2025-present <a href="https://davidingplus.cn/">DavidingPlus</a>'
    }
  },

  vite: {
    plugins: [
      groupIconVitePlugin(),
      llmstxt(),
      AutoImport({
        resolvers: [ElementPlusResolver({ importStyle: false })]
      }),
      Components({
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [ElementPlusResolver({ importStyle: false })]
      })
    ],
    experimental: {
      enableNativePlugin: true
    },
    resolve: {
      alias: [
        {
          find: /^.*\/VPDocAside\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/VPDocAside.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPSidebar\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/VPSidebar.vue', import.meta.url)
          )
        }
      ]
    }
  },

  transformPageData: (pageData, ctx) => {
    const site = resolveSiteDataByRoute(
      ctx.siteConfig.site,
      pageData.relativePath
    )
    const title = `${pageData.title || site.title} | ${pageData.description || site.description}`
      ; ((pageData.frontmatter.head ??= []) as HeadConfig[]).push(
        ['meta', { property: 'og:locale', content: site.lang }],
        ['meta', { property: 'og:title', content: title }]
      )
  }
})
