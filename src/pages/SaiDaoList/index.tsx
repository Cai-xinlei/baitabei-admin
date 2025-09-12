import React, { useEffect, useState } from 'react';
import './index.css';
import { getStatistics } from "@/services/authService";
import { TRACKS, taskIdMap } from '@/constants/index';
import { useNavigate } from 'react-router-dom';

const GridPage = () => {
    const navigator = useNavigate();
    const [statistics, setStatistics] = useState([]);
    useEffect(() => {
        getStatistics().then(res => {
            if (res.code === 200) {
                setStatistics(res?.data?.projectsByTrack)
            }
        })
    }, [])

    const handleGotoProjects = (trackId) => {
        if (!trackId) return
        return navigator(`/projects?trackId=${trackId}`)
    }

    return (
        <div className='gridPage'>
            <div className='cardGrid'>
                {statistics?.map((card) => (
                    <div className='card' key={card.id} onClick={() => handleGotoProjects(card.trackId)}>
                        <div className='imageContainer'

                        >
                            <img
                                src={'https://static.baitabei.hzyuanlian.cn/trackList.jpg'}
                            />
                            <div className='trackTitle'>{taskIdMap[card.trackId]}</div>
                            <div className='number'>{card.projectCount}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default GridPage;
