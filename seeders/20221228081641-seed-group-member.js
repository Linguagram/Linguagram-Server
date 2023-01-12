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
   const groupMembers = require('../data/groupMembers.json')
   const data = groupMembers.map(el=>{
    el.createdAt = new Date();
    el.updatedAt = new Date();
    return el
   })
   

    await queryInterface.bulkInsert('GroupMembers', data)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('GroupMembers', {}, {
      truncate: true, restartIdentity: true, cascade: true
  })

  }
  
};
