import express from 'express';
import { User } from "../model/userModel";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

let userRouter = express.Router();
const JWTKey="B652CE94AB2DE51E78A33B0FB0C0B0F82BC5F1D4FDC4B203219BD8C1CFEBD741";
let userArray: User[] = [];
let regEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

//[GET] /Users/<userId> 
userRouter.get('/:userId', (req, res, next) => {
    let user = userArray.find(user => user.userId == req.params.userId);
    if(user)
    {
        res.status(200).send(user.GetPasswordlessUser());
    }
    else
    {
        res.status(404).send({message:'User not found',status:404});
    }

});

//[GET] /Users
userRouter.get('/', (req, res, next) => {
    res.status(200).send(userArray);
});

//[POST] /Users
userRouter.post('/',(req,res,next)=>{

    if(userArray.find(user => user.userId == req.body.userId))
    {
        res.status(409).send({message:'UserId already in use',status:'409 - Conflict'});
    }
    else if(!regEmail.test(req.body.emailAddress)){
        res.status(406).send({message: 'Invalid Email', status: '406 - Not Acceptable'});
        
    }
    else
    {
        let sentUser = new User('','','','','');
        Object.assign(sentUser, req.body);
        if(sentUser.CompleteUser())
        {
            userArray.push(sentUser);
            res.status(201).send(sentUser.GetPasswordlessUser());
        }
        else
        {
            res.status(406).send({message:'All properties are required for a new user userId,firstName,lastName,emailAddress, password',status:406});
        }
    }
});

//[PATCH] /Users/<userId>
userRouter.patch('/:userId', (req, res, next) => {
    let user = userArray.find(user => user.userId == req.params.userId);
    if(user)
    {
        delete req.body.userId;
        
        Object.keys(user).forEach(function(key) {
            if(req.body.hasOwnProperty(key))
            { 
                    (user as any)[key] = req.body[key];
            }
        });
        res.status(200).send(user.GetPasswordlessUser());
    }
    else
    {
        res.status(404).send({message:'User not found',status:404});
    }
});

//[DELETE] /Users/<userId>
userRouter.delete('/:userId',(req,res,next)=>{
    let index = userArray.findIndex(d => d.userId === req.params.userId);
    if(index<0)
    {
        res.status(404).send({message:'User Not Found', status:'404 - Not Found'});
    }
    else
    {
        userArray.splice(index,1);
        res.status(204).send({message:'User Deleted', status:'204 - No Content'});
    }
       
});

//[GET] /Users/<userId>/<password> 
userRouter.get('/:userId/:password', (req, res, next):void => {
    let user = userArray.find(d => d.userId === req.params.userId);

    console.log(req.params.userId);
    console.log(req.params.password);

    if(user)
    {
            if(user.validatePassword(req.params.password))
            {
                let token = jwt.sign({
                    exp: Math.floor((Date.now() / 1000) + (60 * 60)),
                    data: {
                        userId:user?.userId,
                        firstName:user?.firstName,
                        lastName:user?.lastName,
                        emailAddress:user?.emailAddress
                    }
                }, JWTKey);
                res.send({ token: token });
            }
            else
            {
                res.status(401).send({message:'401 - Not authorized'})
            }
        }
    else
    {
        res.status(401).send({message:'401 - Not authorized'});
    };
});

export { userRouter, JWTKey };