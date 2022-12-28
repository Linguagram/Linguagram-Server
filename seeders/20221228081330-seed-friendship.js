'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   const friendships = require('../data/friendships.json')
   const data = friendships.map(el=>{
    el.createdAt = new Date();
    el.updatedAt = new Date();
    return el
   })
   

    await queryInterface.bulkInsert('Friendships', data)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Friendships', {}, {
      truncate: true, restartIdentity: true, cascade: true
  })

  }
  
};
