
const Sunscription = {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let count = 0

      setInterval(() => {
        count++
        pubsub.publish('count', {
          count
        })
      })

      return pubsub.asyncIterator('count')
    }
  }
}

export { Sunscription as default }