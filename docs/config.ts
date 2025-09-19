import { createRequire } from 'module'
import { defineAdditionalConfig, type DefaultTheme } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('vitepress/package.json')

export default defineAdditionalConfig({
    lang: 'zh-Hans',
    description: '黑神话悟空 实时关键数据显示 MOD 手册',

    themeConfig: {
        nav: nav(),

        search: { options: searchOptions() },

        sidebar: {
            '/guide/': { base: '/guide/', items: guideSidebar() }
        },

        editLink: {
            pattern: 'https://github.com/DavidingPlus/b1-showinfo-docs/edit/master/docs/:path',
            text: '在 GitHub 上编辑此页面'
        },

        docFooter: {
            prev: '上一页',
            next: '下一页'
        },

        lastUpdated: {
            text: '最后更新于'
        },

        outline: {
            level: [2, 3],
            label: '页面导航'
        },

        notFound: {
            title: '页面未找到',
            quote:
                '但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。',
            linkLabel: '前往首页',
            linkText: '带我回首页'
        },

        langMenuLabel: '多语言',
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        skipToContentLabel: '跳转到内容'
    }
})

function searchOptions(): Partial<DefaultTheme.AlgoliaSearchOptions> {
    return {
        placeholder: '搜索文档',
        translations: {
            button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
            },
            modal: {
                searchBox: {
                    resetButtonTitle: '清除查询条件',
                    resetButtonAriaLabel: '清除查询条件',
                    cancelButtonText: '取消',
                    cancelButtonAriaLabel: '取消'
                },
                startScreen: {
                    recentSearchesTitle: '搜索历史',
                    noRecentSearchesText: '没有搜索历史',
                    saveRecentSearchButtonTitle: '保存至搜索历史',
                    removeRecentSearchButtonTitle: '从搜索历史中移除',
                    favoriteSearchesTitle: '收藏',
                    removeFavoriteSearchButtonTitle: '从收藏中移除'
                },
                errorScreen: {
                    titleText: '无法获取结果',
                    helpText: '你可能需要检查你的网络连接'
                },
                footer: {
                    selectText: '选择',
                    navigateText: '切换',
                    closeText: '关闭',
                    searchByText: '搜索提供者'
                },
                noResultsScreen: {
                    noResultsText: '无法找到相关结果',
                    suggestedQueryText: '你可以尝试查询',
                    reportMissingResultsText: '你认为该查询应该有结果？',
                    reportMissingResultsLinkText: '点击反馈'
                }
            }
        }
    }
}

function nav(): DefaultTheme.NavItem[] {
    return [
        { text: '主页', link: '/' },
        {
            text: '文档',
            activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
            items: [
                { text: '开始', link: '/guide' },
                { text: '快速上手', link: '/guide/quick-start/install' }
            ]
        },
        { text: '新榜链接', link: '/guide/ranking-list/new-list' },
        { text: '旧榜链接', link: '/guide/ranking-list/old-list' }
    ]
}

function guideSidebar(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: '开始',
            collapsed: false,
            items: [
                { text: '简介', link: '/' },
                { text: '更新日志', link: '/changelog' }]
        },
        {
            text: '快速上手',
            collapsed: false,
            items: [
                { text: 'MOD 安装教程', link: 'quick-start/install' },
                { text: '版本发布日志', link: 'quick-start/release' },
                { text: '新榜规则', link: 'quick-start/rules' },
                { text: 'OBS 录制环境搭建', link: 'quick-start/record-video' }
            ]
        },
        {
            text: '成绩榜单',
            collapsed: false,
            items: [
                { text: '新榜单', link: 'ranking-list/new-list' },
                { text: '旧榜单', link: 'ranking-list/old-list' }
            ]
        }
    ]
}
