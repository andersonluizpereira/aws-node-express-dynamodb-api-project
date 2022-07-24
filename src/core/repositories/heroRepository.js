const BaseRepository = require('./baseRepository')
const schema = require('./schemas/heroSchema')
class HeroRepository extends BaseRepository {
    constructor() {
        super({
            schema
        })
    }
}

module.exports = HeroRepository