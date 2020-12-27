import express, { response } from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt-nodejs";
import cors from "cors";
import knex from "knex";
import register from "./controllers/register";
import signin from "./controllers/signin";
import profile from "./controllers/profile";
import image from "./controllers/image";

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: '',
        password: '',
        database: 'smart-brain'
    }
});

// db.select('*').from('users').then(data => {
//     console.log(data);
// });

const app = express();
app.use(bodyParser.json());
app.use(cors());

// const database = {
//     users: [{
//             id: '123',
//             name: 'hyungi',
//             email: 'lee@gmail.com',
//             password: 'cookies',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '124',
//             name: 'Sally',
//             email: 'sally@gmail.com',
//             password: 'bananas',
//             entries: 0,
//             joined: new Date()
//         }
//     ],
//     login: [{
//         id: '987',
//         has: '',
//         email: 'lee@gmail.com'
//     }]
// }

/*
    / -->  res = this is working
    /signin --> POST success/fail
    /register --> POST = User Object
    /profile/:userId --> GET = user
    /image --> PUT --> user
*/

app.get('/', (req, res) => {
    res.send('success');
});

// handle function부분을 함수로 처리하지 않고, 아래와 같이 function을 호출하고, 
// 기존의 req, res는 앞서 root에서 받고 있기 때문에 생략하도록 한다.
// app.post('/signin', signin.handleSignin(db, bcrypt)(req, res)); 
app.post('/signin', signin.handleSignin(db, bcrypt));

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) });

app.put('/image', (req, res) => { image.handleImage(req, res, db) });

app.listen(4002, () => {
    console.log('app is running on port 4002');
});