import jwt from 'jsonwebtoken'
import getUserId from './getUserId'

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_TOKEN, { expiresIn: '30 days'})
}

export { generateToken }