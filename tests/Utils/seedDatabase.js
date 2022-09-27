import bcrypt from 'bcryptjs'
import prisma from '../../src/prisma'
import jwt from 'jsonwebtoken'

const userOne = {
    input: {
        name: 'Jen',
        email: 'jen@example.com',
        password: bcrypt.hashSync('password1234')
    },
    user: undefined,
    jwt: undefined
}

const userTwo = {
    input: {
        name: 'Fred',
        email: 'fred@example.com',
        password: bcrypt.hashSync('password1234')
    },
    user: undefined,
    jwt: undefined
}

const seedDatabase =async () =>  {
    // delete test data
    await prisma.mutation.deleteManyUsers()
    // Create user one
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_TOKEN)

    // Create User Two
    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    })
    userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_TOKEN)
}

export { seedDatabase as default, userOne, userTwo }