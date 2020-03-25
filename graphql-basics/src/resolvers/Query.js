const Query = {
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
  users(parent, args, { db }, info) {
    const { query } = args
    if (!query) {
      return db.users
    }
    return db.users.filter((user) => {
      return db.user.name.toLowerCase().includes(query.toLowerCase())
    })
  },
  posts(parent, { query }, { db }, info) {
    if (!query) {
      return db.posts;
    }
    return db.posts.filter((post) => {
      const isTitleMatch = post.title.toLowerCase().includes(query.toLowerCase())
      const isBodyMatch = post.body.toLowerCase().includes(query.toLowerCase())
      return (isTitleMatch || isBodyMatch)
    })
  },
  comments(parent, { query }, { db }, info) {
    return db.comments
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
}

export { Query as default }