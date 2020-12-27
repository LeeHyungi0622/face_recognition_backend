const handleRegister = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;
    // encrypt the password
    var hash = bcrypt.hashSync(password);
    db.transaction(trx => {
            // 첫번째로 login 테이블을 업데이트시켜주고, 
            trx.insert({
                    hash: hash,
                    email: email
                })
                .into('login')
                // 등록했던 email정보를 반환해서
                .returning('email')
                // 반환된 email로 user 테이블에 새로운 데이터를 삽입한다.
                .then(loginEmail => {
                    // 내부의 처리 또한 transaction의 일부로 인식되기 위해 기존의 db('user')를
                    // trx('users')로 바꿔준다.
                    return trx('users')
                        // new user data를 삽입해주고, 모든 칼럼데이터를 반환해준다.(.returning)
                        .returning('*')
                        .insert({
                            email: loginEmail[0],
                            name,
                            joined: new Date()
                        })
                        .then(user => {
                            res.json(user[0]);
                        })
                })
                .then(trx.commit)
                .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
    handleRegister: handleRegister
};