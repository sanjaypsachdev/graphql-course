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
  createPost(parent, { data }, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === data.author)

    if (!userExists) {
      throw new Error('User not found')
    }

    const post = {
      ...data,
      id: uuidv4()
    }

    db.posts.push(post)
    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      })
    }

    return post
  },
  deletePost(parent, args, { db, pubsub }, info) {
    var postIndex = db.posts.findIndex(post => post.id === args.id)

    if (postIndex === -1) {
      throw new Error("Post does not exist")
    }

    const [post] = db.posts.splice(postIndex, 1)

    db.comments = db.comments.filter(comment => comment.post !== args.id)

    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      })
    }

    return post
  },
  updatePost(parent, { id, data }, { db, pubsub }, info) {
    const post = db.posts.find(post => post.id === id)
    const originalPost = { ...post }

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

    let mutation;
    if (originalPost.published && !post.published) {
      mutation = "DELETED"
    } else if (!originalPost.published && post.published) {
      mutation = "CREATED"
    } else if (post.published) {
      mutation = "UPDATED"
    }

    pubsub.publish('post', {
      post: {
        mutation,
        data: post
      }
    })

    return post
  },
  createComment(parent, { data }, { db, pubsub }, info) {
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
    pubsub.publish(`comment ${data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    })

    return comment
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    var commentIndex = db.comments.findIndex(comment => comment.id === args.id)

    if (commentIndex === -1) {
      throw new Error("Comment does not exist")
    }

    const deletedComment = db.comments.splice(commentIndex, 1)[0]
    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment
      }
    })

    return deletedComment
  },
  updateComment(parent, { id, data }, { db, pubsub }, info) {
    const comment = db.comments.find(comment => comment.id === id)

    if (!comment) {
      throw new Error('Comment not found')
    }

    if (typeof data.text === 'string') {

      comment.text = data.text
    }
    console.log(`comment published to comment ${comment.post}`)
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment
      }
    })

    return comment
  }
}

export { Mutation as default }