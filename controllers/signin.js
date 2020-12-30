const handleSignin = (db, bcrypt) => (req, res) => {
    // bcrypt.hash(req.body.password, null, null, function(err, hash) {
    //     // Store hash in your password DB.
    //     console.log(hash);
    // });
    // bcrypt.compare("coolguy", '$2a$10$6c../zXjZQWz7/3V2ZKGKeFgOWWbJEMO2EvuQi2ABVpfjAHU6995G', (err, result) => {
    //     console.log('guess', result);
    // })
    // if (req.body.email === database.users[0].email &&
    //     req.body.password === database.users[0].password) {
    //     res.json(database.users[0]);
    // } else {
    //     res.status(400).json('error logging in');
    // }
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            // isValid (로그인할때 입력한 비밀번호와 login테이블의 비밀번호가 일치하는지 체크)
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                // 반드시 return해줘야 한다.
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        console.log(user);
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
    handleSignin
}