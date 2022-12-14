import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../Utils/getUserId'
import { generateToken } from '../Utils/generateToken'
import hashPassword from '../Utils/hashPassword'

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        const emailTaken = await prisma.exists.User({ email: args.data.email })
        const password = await hashPassword(args.data.password)

        const user = await prisma.mutation.createUser({ 
            data:{
                ...args.data,
                password
            } 
        })

            return {
                user,
                token: generateToken(user.id)
            }

    },

    async deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        return prisma.mutation.deleteUser({ 
            where: {
            id: userId
            }
         }, info)
    },

    async updateUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        if (typeof args.data.password === 'string'){
            args.data.password = await hashPassword(args.data.password)
        }

        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info)

    },

    async login(parent, args, { prisma }, info) {
        const user = await prisma.query.user({
            where:{
                 email: args.data.email
            } 
        })
        const password = args.data.password
        const hashedPassword = user.password

        if (!user){
            throw new Error('Unable to login')
        }
        const isMatch = await bcrypt.compare(password, hashedPassword)

        if (!isMatch) {
            throw new Error('Unable to login')
        }

        return {
            user,
            token: generateToken(user.id)
        }

    }
}

 export { Mutation as default}