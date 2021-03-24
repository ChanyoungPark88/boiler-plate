const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const {auth} = require('./middleware/auth')
const {User} = require('./models/User')

// bodyPaser 설정
app.use(bodyParser.urlencoded({extended:true})) // application/x-www-form-urlencoded
app.use(bodyParser.json())                      // application/json
app.use(cookieParser())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(()=>console.log('MongoDB Connected!!'))
  .catch(err=>console.log(err))


app.get('/',(req,res)=>res.send('Fuck you world! You guys all suck!'))

app.get('/api/hello',(req,res)=>res.send('Hello guys'))

// register Route
app.post('/api/users/register',(req,res)=>{
    // 회원가입할 때 필요한 정보들을 클라이언트에서 가져오면 DB에 넣어준다.
    const user = new User(req.body)
    user.save((err,userInfo)=>{
        if(err) return res.json({success:false, err})
        return res.status(200).json({success:true})
    })
})

// login Route
app.post('/api/users/login',(req,res)=>{
    // 요청된 이메일이 DB에 있는지 확인
    User.findOne({email:req.body.email},(err,userInfo)=>{
        if(!userInfo){
            return res.json({
                loginSuccess:false,
                message:"제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        // 요청된 이메일에 대한 비밀번호가 일치하는지 확인
        userInfo.comparePassword(req.body.password,(err,isMatch)=>{
            if(!isMatch){
                return res.json({
                    loginSuccess:false,
                    message:"비밀번호가 틀렸습니다"
                })
            }else{
                // 모든 정보가 일치한다면 토큰을 생성
                userInfo.generateToken((err,user)=>{
                    if(err) return res.status(400).send(err)
                    res.cookie('x_auth',userInfo.token)
                    .status(200)
                    .json({
                        loginSuccess:true,
                        userId:userInfo._id
                    })
                })
            }
        })
    })
})

// auth Route
app.get('/api/users/auth',auth,(req,res)=>{
    res.status(200).json({
        _id:req.user._id,
        isAdmin:req.user.role === 0 ? false : true,
        isAuth:true,
        email:req.user.email,
        name:req.user.name,
        lastname:req.user.lastname,
        role:req.user.role,
        image:req.user.image
    })
})

// logout Route
app.get('/api/users/logout',auth,(req,res)=>{
    User.findOneAndUpdate({_id:req.user._id},{token:''},(err,user)=>{
        if(err) return res.json({success:false,err})
        return res.status(200).send({
            success:true
        })
    })
})
app.listen(port,()=>console.log(`Example app listening on port ${port}!`))