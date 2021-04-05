import React, { useEffect, useState } from 'react'
// import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row} from 'antd'
// import Icon from '@ant-design/icons'
import moment from 'moment'
import Axios from 'axios';

const { Title } = Typography
const { Meta } = Card

function LandingPage() {
    const [Video, setVideo] = useState([])
    useEffect(() => {
        Axios.get('/api/video/getVideos')
        .then(response => {
            if(response.data.success) {
                console.log(response.data)
                setVideo(response.data.videos)
            } else {
                alert('Failed to load videos')
            }
        })
    }, [])

    const renderCards = Video.map((video,index)=> {
        // console.log(video.writter)
        var minutes = Math.floor(video.duration / 60)
        var seconds = Math.floor((video.duration - minutes * 60))

        return <Col lg={6} md={8} xs={24}>
            <a href={`/video/post/${video._id}`}>
                <div style={{position:'relative'}}>
                    <img style={{width:'100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt='thumbnail' />
                    <div className='duration'>
                        <span>{minutes}:{seconds}</span>
                    </div>
                </div>
            </a>
            <br />
            <Meta
                avatar={
                    <Avatar src={video.thumbnail} />
                }
                title={video.title}
                description=''
            />
            
            <span>{video.writter.name}</span><br />
            <span style={{marginLeft:'3rem'}}>{video.views} veiws</span> - <span>{moment(video.createAt).format('MMM Do YY')}</span>
        </Col>
    })
    return (
        <div style={{width:'85%', margin:'3rem auto'}}>
            <Title level={2}> Recommended </Title>
            <hr />
            <Row gutter={[32,16]}>
                {renderCards}
            </Row>
        </div>
    )
}

export default LandingPage
