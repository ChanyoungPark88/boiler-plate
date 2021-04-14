import React, { useEffect, useState } from 'react'
import { List, Row, Col, Avatar } from 'antd'
import axios from 'axios'
import SideVideo from './Sections/SideVideo'
import Subscribe from './Sections/Subscribe'

function VideoDetailPage(props) {
    const videoId = props.match.params.videoId
    const variable = {videoId: videoId}
    const [Video, setVideo] = useState([])

    useEffect(() => {
        axios.post('/api/video/getVideo', variable)
        .then(response => {
            if(response.data.success) {
                setVideo(response.data.video)
            } else {
                alert('Failed load video info')
            }
        })
    },[])
    if(Video.writter){
        const subscribeButton = Video.writter._id !== localStorage.getItem('userId') && <Subscribe userTo={Video.writter._id} userFrom={localStorage.getItem('userId')}/>
        return (
            <Row gutter={[16,16]}>
                <Col lg={18} xs={24}>
                    <div style={{width:'100%', padding:'3rem 4rem'}}>
                        <video style={{width:'100%'}} src={`http://localhost:5000/${Video.filePath}`} controls />
                        <List.Item
                            actions={[subscribeButton]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={Video.avatar} />}
                                title={Video.title}
                                description={Video.description}
                            />
                        </List.Item>
                        {/* Comments */}
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        )
    } else {
        return(<div>Loading</div>)
    }
}

export default VideoDetailPage
