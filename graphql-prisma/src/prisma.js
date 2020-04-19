import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
})

// prisma.query.users(null, '{ id name email posts { id title } }')
//             .then(data => console.log(JSON.stringify(data, undefined, 2)))

// prisma.query.comments(null, '{ id text author { id name } }')
//             .then(data => console.log(JSON.stringify(data, undefined, 2)))

// prisma.mutation.createPost({
//   data: {
//     title: "GraphQL 101",
//     body: "",
//     published: false,
//     author: {
//       connect: {
//         id: "ck8lyybn200dv0a827tf18664"
//       }
//     }
//   }
// }, '{ id title body published }').then(data => {
//   console.log(JSON.stringify(data))
//   return prisma.query.users(null, '{ id name email posts { id title } }')
// }).then(data => {
//   console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.mutation.updatePost({
//   data: {
//     published: true,
//     body: "GraphQL 101 Body"
//   },
//   where: {
//     id: "ck8rgv7vi00cq0d1611k41y0c"
//   }
// }, '{ id title body published }').then(data => {
//   console.log(JSON.stringify(data))
//   return prisma.query.posts(null, '{ id title body published }')
// }).then(data => {
//   console.log(JSON.stringify(data, undefined, 2))
// })

const createPostForUser = async (authorId, data) => {
  const userExists = await prisma.exists.User({ id: authorId })

  if (!userExists) {
    throw new Error('User not found')
  }

  const post = await prisma.mutation.createPost({
    data: {
      ...data,
      author: {
        connect: {
          id: authorId
        }
      }
    }
  }, ' { author { id name email posts { id title published } } } ')
  return post.author
}

// createPostForUser('ck8ly1zkx004x0a82cygcic08', {
//   title: 'Great books to read',
//   body: 'The war of art',
//   published: true
// }).then(user => 
//   console.log(JSON.stringify(user, undefined, 2)
// )).catch(error => 
//   console.log(error)
// )

const updatePostForUser = async (postId, data) => {
  const postExist = await prisma.exists.Post({ id: postId })

  if (!postExist) {
    throw Error('Post does not exist')
  }

  const post = await prisma.mutation.updatePost({
    where: {
      id: postId
    },
    data
  }, '{ author { id name email posts { id title published } } }')
  return post.author
}

updatePostForUser("ck8rhnrce00fo0d16nv7v7to6", { published: false }).then(user => 
  console.log(JSON.stringify(user, undefined, 2))
).catch(error => 
  console.log(error)
)