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
    const interests = require('../data/interests.json')
    const data = interests.map(el=>{
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el
     })
     
  
      await queryInterface.bulkInsert('Interests', data)
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Interests', {}, {
      truncate: true, restartIdentity: true, cascade: true
  })
  }
};
