const BaseRepository = require('./baseRepository')
const schema = require('./schemas/skillSchema')
class SkillRepository extends BaseRepository {
    constructor() {
        super({
            schema
        })
    }
}

module.exports = SkillRepository