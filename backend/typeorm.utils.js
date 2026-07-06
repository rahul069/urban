"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepositoryToken = getRepositoryToken;
exports.getDataSourceToken = getDataSourceToken;
exports.generateString = generateString;
exports.generateConnectionName = generateConnectionName;
function getRepositoryToken(entity) {
    return `${entity.name}Repository`;
}
function getDataSourceToken(dataSource) {
    return dataSource && typeof dataSource.name === 'string'
        ? `${dataSource.name}DataSource`
        : 'DefaultDataSource';
}
function generateString() {
    return (Math.random() + 1).toString(36).substring(2);
}
/**
 * This function generates a string that is used as a connection name.
 */
function generateConnectionName() {
    return generateString();
}