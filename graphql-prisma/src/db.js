
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

const db = {
  users,
  posts,
  comments
}

export { db as default }