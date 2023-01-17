import express from 'express';
import jwt from 'jsonwebtoken';
import { Post } from '../model/postModel';
import { User } from "../model/userModel";
import bcrypt from 'bcrypt';

let postRouter = express.Router();
const JWTKey="B652CE94AB2DE51E78A33B0FB0C0B0F82BC5F1D4FDC4B203219BD8C1CFEBD741";
let postArray: Post[] = [];

postRouter.get('/User/:userId',(req, res, next) =>{
    //cries in serbo-croatian;
    let user = postArray.find(element => element.userId == req.params.userId);
    let newPostArray: Post[] = [];

    for(let i=0; i < postArray.length; i++){
        if(postArray[i].userId === req.params.userId){
            newPostArray.unshift(postArray[i])
        }
    }

    if(user){
        res.send(newPostArray);
    }
    else{
        res.status(404).send("404 - Not Found");
    }
});

postRouter.get('/', (req, res, next) => {

    res.status(200).send(postArray);

});

postRouter.get('/:postId', (req, res, next) => {
    let post = postArray.find(element => element.postId.toString() == req.params.postId);

    if (post == undefined) {

        res.status(404).send("404 - Not Found");

    }

    res.status(200).send(post);

});

postRouter.post('/', (req, res, next) => {
        let newPost = new Post(postArray.length, new Date(), '', '', res.locals.userId, '', new Date());
        Object.assign(newPost, req.body);
        if(newPost.CompletePost())
        {
            postArray.unshift(newPost);
            res.status(201).send(newPost);
        }
        else{
            res.status(406).send("406 - Not Acceptable");
        }
});

postRouter.patch('/:postId', (req, res, next) => {
    let post = postArray.find(post => post.postId == parseInt(req.params.postId));
    if(post)
    {
        delete req.body.postId;
        
        Object.keys(post).forEach(function(key) {
            if(req.body.hasOwnProperty(key))
            { 
                    (post as any)[key] = req.body[key];
            }
        });
        post.lastUpdated = new Date();
        res.status(200).send(post);
    }
    else
    {
        res.status(404).send({message:'User not found',status:404});
    }
});

postRouter.delete('/:postId',(req,res,next)=>{
    let post = postArray.find(user => user.postId == parseInt(req.params.postId));
    if(post)
    {
        postArray.splice(postArray.indexOf(post),1);
        res.status(204).send({message:'Post deleted',status:204});
    }
    else
    {
        res.status(404).send({message:'Post not found',status:404});
    }
       
});
export { postRouter, JWTKey };