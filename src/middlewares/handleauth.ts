import express from 'express';
import jwt from 'jsonwebtoken';
import { JWTKey } from '../router/userRouter';

let authRouter = express.Router();

authRouter.use('/', (req, res, next) => {
    console.log(req.url);
    console.log(req.method);
    let ary = [
        {
            method: 'GET',
            url: '/Users'
        },
        {
            method: 'PATCH',
            url: '/Users'
        },
        {
            method:'DELETE',
            url:'/Users'
        },
        {
            method: 'POST',
            url: '/Posts'
        },
        {
            method: 'PATCH',
            url: '/Posts'
        },
        {
            method:'DELETE',
            url:'/Posts'
        }
    ];
    let cont=true;
    for (let per of ary) {
        if (req.url.includes(per.url) && req.method == per.method) {
            if (req.headers['authorization']) {
                try {
                    let verifiedToken = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), JWTKey);
                    if (verifiedToken) {
                        res.locals.userId = (verifiedToken as jwt.JwtPayload).data.userId;
                        continue;
                    }
                    else {
                        cont=false;
                        break;
                    }
                }
                catch
                {
                    cont=false;
                    break;
                }
            }
            else
            {
                cont=false;
                break;
            }
        }
    }
    if(cont)
       next();
    else
    {
        res.status(401).send({message:'UnAuthorized', status:401});
    }
    
});
export { authRouter };