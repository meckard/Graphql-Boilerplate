import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './Utils/seedDatabase'
import getClient from './Utils/getClient'
import { createUser, getUsers, login, getProfile} from './Utils/operations'
 
const client = getClient()

beforeEach(seedDatabase)

test("Should create a new user", async (done) => {
    const variables = {
        data: {
            name: "Micah",
            email: "micah@micah.com",
            password: "password1234"
        }
    }

   const response = await client.mutate({
        mutation: createUser,
        variables
    })
    const userExists =  await prisma.exists.User({ id:response.data.createUser.user.id })

    expect(userExists).toBe(true)

    done()
    },
)

test('Should expose public author profiles', async () => {
    const response = await client.query({ query: getUsers })

    expect(response.data.users.length).toBe(2)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[0].name).toBe('Jen')


})


test('Should not login with bad credentials', async () => {
    const variables = {
        data: {
            email: "jen@example.com",
            password: "password"
        }
    }

   await expect(client.mutate({ mutation: login, variables })
   ).rejects.toThrow()

})

test('Should reject because of short password', async () => {
    const variables = {
        data: {
            name: "Alanna",
            email: "alanna@example.com",
            password: "passwo"
        }
    }

    await expect(client.mutate({ mutation: createUser, variables })
    ).rejects.toThrow()
})

test('Should fetch user profile', async () => {
    const client = getClient(userOne.jwt)
    
    const { data } = await client.query({ query: getProfile })

    expect(data.me.id).toBe(userOne.user.id)
    expect(data.me.name).toBe(userOne.user.name)
    expect(data.me.email).toBe(userOne.user.email)

    
})

