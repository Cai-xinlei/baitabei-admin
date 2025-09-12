

// 2025年白塔杯六大赛道
export const TRACKS = [
    {
        link: 'cultural_innovation',
        value: '',
        label: '全部',
    },
    {
        link: 'cultural_innovation',
        value: 1,
        label: '文创产品开发赛道',
    },
    {
        link: 'creative_design',
        value: 2,
        label: '城市消费场景设计赛道',
    },
    {
        link: 'business_model',
        value: 3,
        label: '文化消费内容创新赛道',
    },
    {
        link: 'social_innovation',
        value: 4,
        label: '文商旅体科技创新应用赛道',
    },
    {
        link: 'communication_promotion',
        value: 5,
        label: '非遗创新转化应用赛道',
    },
];
export const taskIdMap = {
    1: '文创产品开发赛道',
    2: '城市消费场景设计赛道',
    3: '文化消费内容创新赛道',
    4: '文商旅体科技创新应用赛道',
    5: '非遗创新转化应用赛道'
}

export const roleList = [
    { value: "1", label: "超级管理员" },
    // { value: "2", label: "赛事管理员" },
    { value: "3", label: "评审专家" },
    // { value: "4", label: "普通管理员" },
    { value: "5", label: "参赛者" },
]

export const projectTypeOption = [
    { label: '实践案例', value: "practical" },
    { label: '概念方案', value: "conceptual" },
    { label: '场景创新类', value: "scene" },
    { label: '内容创新类', value: "content" },
    { label: '技术创新类', value: "technological" },
    { label: '非遗文创产品开发类', value: "product-development" },
    { label: '非遗数字技术创新', value: "technological-innovation" },
    { label: '非遗教育科普', value: "education" },
    { label: '非遗演艺创新及影视创作转化', value: "transformation" },
]
