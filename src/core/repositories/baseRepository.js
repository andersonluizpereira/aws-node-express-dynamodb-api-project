const { promisify } = require('util')
class BaseRepository {
    constructor({ schema }) {
        this.schema = schema
    }

    async create(item) {
        return promisify(this.schema.create)(item)
    }

    async findOne(id) {
        console.log('findOne', id)
        return promisify(this.schema.get)(id)
    }

    async findAll(query) {
        return promisify(this.schema.scan)(query)
    }
}
module.exports = BaseRepository