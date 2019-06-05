const xss = require('xss')
const Treeize = require('treeize')

const RewardsService = {
  getById(db, reward_id) {
    return db
      .from('backburner_rewards')
      .where('id', reward_id)
      .first()
  },
  
  getUserRewards(db, user_id) {
    return db
      .from('backburner_rewards AS rwd')
      .select(
        'rwd.id',
        'rwd.reward'
      )
      .where(
        'rwd.user_id', user_id
      )
  },

  insertNewReward(db, newReward) {
    return db
      .insert(newReward)
      .into('backburner_rewards')
      .returning('*')
      .then(([reward]) => reward)
      .then(reward =>
        RewardsService.getById(db, reward.id)  
      )
  },

  serializeRewards(rewards) {
    return rewards.map(this.serializeReward)
  },

  serializeReward(reward) {
    const rewardTree = new Treeize()

    const rewardData = rewardTree.grow([ reward ]).getData()[0]

    return {
      id: reward.id,
      reward: xss(reward.reward),
      user_id: xss(reward.user_id)
    }
  }
}

module.exports = RewardsService