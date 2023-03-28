'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addConstraint(
        'products',
        {
          fields: ['userId'],
          type: 'FOREIGN KEY', name: 'Products_userId_Users_fk',
          references: {
            table: 'Users',
            field: 'id'
          }
        }
    )
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeConstraint(
        'products',
        'Products_userId_Users_fk'
    )
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
