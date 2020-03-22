import { GraphQLServer } from 'graphql-yoga';

// Demo user data
const users = [{
  id: '1',
  name: 'Andrew',
  email: 'andrew@example.com',
  age: 27,
  posts: ['1', '2'],
  comments: ['102', '103']
}, {
  id: '2',
  name: 'Sarah',
  email: 'sarah@example.com',
  posts: ['3'],
  comments: ['104']
}, {
  id: '3',
  name: 'Michael',
  email: 'michael@example.com',
  posts: [],
  comments: ['105']
}]

const posts =  [{
  id: '1',
  title: 'GraphQL 101',
  body: 'This is how to use GraphQL...',
  published: true,
  author: '1',
  comments: ['102']
}, {
  id: '2',
  title: 'GraphQL 201',
  body: 'This is an advanced GraphQL post...',
  published: false,
  author: '1',
  comments: ['103']
}, {
  id: '3',
  title: 'Programming music',
  body: '',
  published: false,
  author: '2',
  comments: ['104', '105']
}]

const comments = [
  {
    id: '102',
    text: 'GraphQL is awesome',
    author: '1',
    post: '1'
  },
  {
    id: '103',
    text: 'GraphQL is fast',
    author: '1',
    post: '2'
  },
  {
    id: '104',
    text: 'GraphQL is flexible',
    author: '2',
    post: '3'
  },
  {
    id: '105',
    text: 'GraphQL is better',
    author: '3',
    post: '3'
  }
]

// Type definitions (Schema)
const typeDefs = `
  type Query {
    greeting(name: String, position: String): String!
    add(numbers: [Float!]!): Float!
    grades: [Int!]!
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment]
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID
    title: String!
    body: String!
    published: Boolean!
    author: User
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`

// Resolver
const resolvers = {
  Query: {
    greeting(parent, args, ctx, info) {
      if (args.name && args.position) {
        return `Hello, ${args.name}! You are my favorite ${args.position}`
      } else {
        return "Hello!"
      }
    },
    add(parent, args, ctx, info) {
      let { numbers } = args
      if (numbers.length === 0) {
        return 0
      }
      return numbers.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
      })
    },
    grades(parent, args, ctx, info) {
      return [99, 80, 88]
    },
    users(parent, args, ctx, info) {
      const { query } = args
      if (!query) {
        return users
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(query.toLowerCase())
      })
    },
    posts(parent, { query }, ctx, info) {
      if (!query) {
        return posts;
      }
      return posts.filter((post) => {
        const isTitleMatch = post.title.toLowerCase().includes(query.toLowerCase())
        const isBodyMatch = post.body.toLowerCase().includes(query.toLowerCase())
        return (isTitleMatch || isBodyMatch)
      })
    },
    comments(parent, args, ctx, info) {
      return comments
    },
    me() {
      return {
        id: '123098',
        name: 'Mike',
        email: 'mike@example.com'
      }
    },
    post() {
      return {
        id: '111',
        title: 'Post1',
        body: 'Post1Body',
        published: true
      }
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      const { author } = parent
      return users.find((user) => user.id === author)
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.post === parent.id)
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.author === parent.id)
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => post.id === parent.post)
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('The server is up!')
})