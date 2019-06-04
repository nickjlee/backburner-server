const xss = require('xss')
const Treeize = require('treeize')

const RewardsService = {
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
  },

  serializeRewards(rewards) {
    return rewards.map(this.serializeReward)
  },

  serializeReward(reward) {
    const rewardTree = new Treeize()

    const rewardData = rewardTree.grow([ reward ]).getData()[0]

    return {
      id: rewardData.id,
      reward: xss(rewardData.reward)
    }
  }
}

module.exports = RewardsService