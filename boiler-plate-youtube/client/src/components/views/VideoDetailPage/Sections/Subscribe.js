import React,{useEffect,useState} from 'react'
import axios from 'axios'

function Subscribe(props) {
    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)
    useEffect(() => {
        let variable = {userTo:props.userTo}
        axios.post('/api/subscribe/subscribeNumber', variable)
        .then(response=>{
            if(response.data.success){
                setSubscribeNumber(response.data.subscribeNumber)
            }else{
                alert(`Couldn't Fetch Subscriber's count`)
            }
        })

        let subscribedVariable = {userTo:props.userTo,userFrom:localStorage.getItem('userId')}
        axios.post('/api/subscribe/subscribed',subscribedVariable)
        .then(response=>{
            if(response.data.success){
                setSubscribed(response.data.subscribed)
            }else{
                alert('Failed fetch userDetail')
            }
        })
    }, [])
    const onSubscribe = () => {
        let subscribedVariable = {
            userTo:props.userTo,
            userFrom:props.userFrom
        }
        if(Subscribed){
            axios.post('/api/subscribe/unSubscribe',subscribedVariable)
            .then(response=>{
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber-1)
                    setSubscribed(!Subscribed)
                }else{
                    alert('Failed unsubscribe')
                }
            })
        }else{
            axios.post('/api/subscribe/subscribe',subscribedVariable)
            .then(response=>{
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber+1)
                    setSubscribed(!Subscribed)
                }else{
                    alert('Failed subscribe')
                }
            })
        }
    }
    return (
        <div>
            <button
                style={{
                    backgroundColor:`${Subscribed ? '#AAAAAA' : '#CC0000'}`,borderRadius:'4px',
                    color:'white',padding:'10px 16px',
                    fontWeight:'500',fontSize:'1rem',textTransform:'uppercase'
                }} onClick={onSubscribe}
            >{SubscribeNumber}  {Subscribed ? 'Subscribed' : 'Subscribe'}</button>
        </div>
    )
}

export default Subscribe
