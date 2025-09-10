import React from 'react';
import './index.css';

const GridPage = () => {
    const cardData = [
        {
            id: 'cultural_innovation',
            name: '文创产品开发赛道',
            image: 'https://static.baitabei.hzyuanlian.cn/wenchang.jpg',
            num: 20,
        },
        {
            id: 'creative_design',
            name: '城市消费场景设计赛道',
            image: 'https://static.baitabei.hzyuanlian.cn/chengshixiaofei.jpg',
            num: 220,
        },
        {
            id: 'business_model',
            name: '文化消费内容创新赛道',
            image: 'https://static.baitabei.hzyuanlian.cn/wenhuaxiaofei.jpg',
            num: 67,

        },
        {
            id: 'social_innovation',
            name: '文商旅体科技创新应用赛道',
            image: 'https://static.baitabei.hzyuanlian.cn/shanglv.jpg',
            num: 55,
        },
        {
            id: 'communication_promotion',
            name: '非遗创新转化应用赛道',
            image: 'https://static.baitabei.hzyuanlian.cn/trackList.jpg',
            num: 34,

        },
    ];

    return (
        <div className='gridPage'>
            <div className='cardGrid'>
                {cardData.map((card) => (
                    <div className='card' key={card.id}>
                        <div className='imageContainer'

                        >
                            <img
                                src={'https://static.baitabei.hzyuanlian.cn/trackList.jpg'}
                            />
                            <div className='trackTitle'>{card.name}</div>
                            <div className='number'>{card.num}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default GridPage;
