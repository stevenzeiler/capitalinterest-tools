const { planaria } = require("neonplanaria")
const MongoClient = require('mongodb')
var db
const connect = (cb) => {
  MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true}, (err, client) => {
    if (err) {
      console.log("retrying...")
      setTimeout(() => { connect(cb) }, 1000)
    } else {
      db = client.db("capitalinterest_radioshow")
      cb()
    }
  })
}
planaria.start({
  filter: {
    "from": 609000,
    "q": {
      "find": { "out.s1": "1HSbJWmeWan2PGTJ2zJjztSsZGXK7KF5N4" },
      "project": {
        "out.s2": 1,
        "out.s3": 1,
        "out.s4": 1,
        "out.s5": 1
      }
    }
  },
  onmempool: async (e) => { await db.collection("u").insertMany([e.tx]) },
  onblock: async (e) => { await db.collection("c").insertMany(e.tx) },
  onstart: (e) => {
    return new Promise(async (resolve, reject) => {
      if (!e.tape.self.start) {
        await planaria.exec("docker", ["pull", "mongo:4.0.4"])
        await planaria.exec("docker", ["run", "-d", "-p", "27017-27019:27017-27019", "-v", process.cwd() + "/db:/data/db", "mongo:4.0.4"])
      }
      connect(() => {
        if (e.tape.self.start) db.collection("c").deleteMany({ "blk.i": { "$gt": e.tape.self.end } }).then(resolve)
        else resolve()
      })
    })
  }
})
