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
      .from('backburner_rewards')
      .select(
        'id',
        'reward',
        'user_id'
      )
      .where(
        'user_id', user_id
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

  deleteReward(db, rewardId) {
    return db
      .from('backburner_rewards')
      .where('id', rewardId)
      .delete()
  },

  serializeRewards(rewards) {
    return rewards.map(this.serializeReward)
  },

  serializeReward(reward) {
    const rewardTree = new Treeize()

    const rewardData = rewardTree.grow([ reward ]).getData()[0]
    
    return {
      id: rewardData.id,
      reward: xss(rewardData.reward),
      user_id: rewardData.user_id
    }
  }
}

module.exports = RewardsService