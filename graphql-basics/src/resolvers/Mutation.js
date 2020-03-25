import uuidv4 from 'uuid/v4'

const Mutation = {
  createUser(parent, { data }, { db }, info) {
    const emailTaken = db.users.some(user => user.email === data.email)
    if (emailTaken) {
      throw new Error('Email is taken.')
    }

    const user = {
      ...data,
      id: uuidv4()
    }

    db.users.push(user)

    return user
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex(user => user.id === args.id)

    if (userIndex === -1) {
      throw new Error("User does not exist")
    }

    const deletedUser = db.users.splice(userIndex, 1)[0]

    const posts = db.posts.filter(post => {
      const match = post.id === args.id

      if (match) {
        db.comments = db.comments.filter(comment => comment.post !== post.id)
      }

      return !match
    })

    db.comments = db.comments.filter(comment => comment.author !== args.id)

    return deletedUser
  },
  updateUser(parent, { id, data }, { db }, info) {
    const user = db.users.find(user => user.id === id)

    if (!user) {
      throw new Error('User not found')
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email)

      if (emailTaken) {
        throw new Error('Email taken')
      }

      user.email = data.email
    }

    if (typeof data.name === 'string') {
      user.name = data.name
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age
    }

    return user
  },
  createPost(parent, { data }, { db }, info) {
    const userExists = db.users.some(user => user.id === data.author)

    if (!userExists) {
      throw new Error('User not found')
    }

    const post = {
      ...data,
      id: uuidv4()
    }

    db.posts.push(post)

    return post
  },
  deletePost(parent, args, { db }, info) {
    var postIndex = db.posts.findIndex(post => post.id === args.id)

    if (postIndex === -1) {
      throw new Error("Post does not exist")
    }

    const deletedPost = db.posts.splice(postIndex, 1)[0]

    db.comments = db.comments.filter(comment => comment.post !== args.id)

    return deletedPost
  },
  updatePost(parent, { id, data }, { db }, info) {
    const post = db.posts.find(post => post.id === id)

    if (!post) {
      throw new Error('Post not found')
    }

    if (typeof data.title === 'string') {

      post.title = data.title
    }

    if (typeof data.body === 'string') {
      post.body = data.body
    }

    if (typeof data.published == 'boolean') {
      post.published = data.published
    }

    return post
  },
  createComment(parent, { data }, { db }, info) {
    const userExists = db.users.some(user => user.id === data.author)
    const postExists = db.posts.some(post => post.id === data.post && post.published)

    let errorText = ""
    if (!userExists) {
      errorText += `User with id ${data.author} does not exist.`
    }

    if (!postExists) {
      errorText += `Post with id ${data.post} does not exist or it is not published.`
    }

    if (!userExists || !postExists) {
      throw new Error(errorText)
    }

    const comment = {
      ...data,
      id: uuidv4()
    }

    db.comments.push(comment)

    return comment
  },
  deleteComment(parent, args, { db }, info) {
    var commentIndex = db.comments.findIndex(comment => comment.id === args.id)

    if (commentIndex === -1) {
      throw new Error("Comment does not exist")
    }

    const deletedComment = db.comments.splice(commentIndex, 1)[0]

    return deletedComment
  },
  updateComment(parent, { id, data }, { db }, info) {
    const comment = db.comments.find(comment => comment.id === id)

    if (!comment) {
      throw new Error('Comment not found')
    }

    if (typeof data.text === 'string') {

      comment.text = data.text
    }

    return comment
  }
}

export { Mutation as default }