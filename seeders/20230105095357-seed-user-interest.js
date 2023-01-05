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
    const userInterests = require('../data/userInterests.json')
    const data = userInterests.map(el=>{
     el.createdAt = new Date();
     el.updatedAt = new Date();
     return el
    })
    
 
     await queryInterface.bulkInsert('UserInterests', data)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('UserInterests', {}, {
      truncate: true, restartIdentity: true, cascade: true
  })
  }
};
