"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNegationExpression = exports.isThisExpression = exports.isAssignmentPattern = exports.isParenthesizedExpression = exports.isExportNamedDeclaration = exports.isBlockStatement = exports.isProgram = exports.isVariableDeclarator = exports.isExpressionStatement = exports.isModuleImport = exports.isRequireCall = exports.isProperty = exports.isImportDeclaration = exports.isSpreadElement = exports.isObjectPattern = exports.isTemplateLiteral = exports.isArrayExpression = exports.isObjectExpression = exports.isAnyCreateFunctionNode = exports.isFunctionDeclaration = exports.isArrowFunctionExpression = exports.isFunctionExpression = exports.isSimpleLiteral = exports.isImportNamespaceSpecifier = exports.isImportDefaultSpecifier = exports.isImportSpecifier = exports.isIdentifier = exports.isAssignmentExpression = exports.isMemberExpression = exports.isSimpleCallExpression = exports.isNewExpression = exports.isCallExpression = void 0;
/**
 * Represents both constructor and non-constructor calls
 * @param expr
 */
function isCallExpression(expr) {
    return isSimpleCallExpression(expr) || isNewExpression(expr);
}
exports.isCallExpression = isCallExpression;
/**
 * Represents all constructor calls
 * @param expr
 */
function isNewExpression(expr) {
    return expr && expr.type === 'NewExpression';
}
exports.isNewExpression = isNewExpression;
/**
 * Represents all non-constructor calls
 * @param expr
 */
function isSimpleCallExpression(expr) {
    return expr && expr.type === 'CallExpression';
}
exports.isSimpleCallExpression = isSimpleCallExpression;
/**
 * Represents property reads
 * @param node
 */
function isMemberExpression(node) {
    return node && node.type === 'MemberExpression';
}
exports.isMemberExpression = isMemberExpression;
function isAssignmentExpression(node) {
    return node && node.type === 'AssignmentExpression';
}
exports.isAssignmentExpression = isAssignmentExpression;
/**
 * Represents identifier nodes, e.g., 'o' and 'p' in o.p
 * @param node
 */
function isIdentifier(node) {
    return node && node.type === 'Identifier';
}
exports.isIdentifier = isIdentifier;
function isImportSpecifier(node) {
    return node && node.type === 'ImportSpecifier';
}
exports.isImportSpecifier = isImportSpecifier;
function isImportDefaultSpecifier(node) {
    return node && node.type === 'ImportDefaultSpecifier';
}
exports.isImportDefaultSpecifier = isImportDefaultSpecifier;
function isImportNamespaceSpecifier(node) {
    return node && node.type === 'ImportNamespaceSpecifier';
}
exports.isImportNamespaceSpecifier = isImportNamespaceSpecifier;
/**
 * returns true if node represents a non-regex literal
 * @param node
 */
function isSimpleLiteral(node) {
    return node && node.type === 'Literal' && node.regex == undefined;
}
exports.isSimpleLiteral = isSimpleLiteral;
function isFunctionExpression(node) {
    return node && node.type === 'FunctionExpression';
}
exports.isFunctionExpression = isFunctionExpression;
function isArrowFunctionExpression(node) {
    return node && node.type === 'ArrowFunctionExpression';
}
exports.isArrowFunctionExpression = isArrowFunctionExpression;
function isFunctionDeclaration(node) {
    return node && node.type === 'FunctionDeclaration';
}
exports.isFunctionDeclaration = isFunctionDeclaration;
function isAnyCreateFunctionNode(node) {
    return isFunctionExpression(node) || isArrowFunctionExpression(node) || isFunctionDeclaration(node);
}
exports.isAnyCreateFunctionNode = isAnyCreateFunctionNode;
function isObjectExpression(node) {
    return node && node.type === 'ObjectExpression';
}
exports.isObjectExpression = isObjectExpression;
function isArrayExpression(node) {
    return node && node.type === 'ArrayExpression';
}
exports.isArrayExpression = isArrayExpression;
function isTemplateLiteral(node) {
    return node && node.type === 'TemplateLiteral';
}
exports.isTemplateLiteral = isTemplateLiteral;
function isObjectPattern(node) {
    return node && node.type === 'ObjectPattern';
}
exports.isObjectPattern = isObjectPattern;
function isSpreadElement(node) {
    return node && node.type === 'SpreadElement';
}
exports.isSpreadElement = isSpreadElement;
function isImportDeclaration(node) {
    return node && node.type === 'ImportDeclaration';
}
exports.isImportDeclaration = isImportDeclaration;
function isProperty(node) {
    return node && node.type === 'Property';
}
exports.isProperty = isProperty;
function isRequireCall(node) {
    return isSimpleCallExpression(node) && isIdentifier(node.callee) && node.callee.name === 'require' &&
        node.arguments.length === 1;
}
exports.isRequireCall = isRequireCall;
function isModuleImport(n) {
    return isRequireCall(n) || isImportDefaultSpecifier(n) || isImportNamespaceSpecifier(n) || isImportSpecifier(n) || isImportDeclaration(n);
}
exports.isModuleImport = isModuleImport;
function isExpressionStatement(node) {
    return node && node.type === 'ExpressionStatement';
}
exports.isExpressionStatement = isExpressionStatement;
function isVariableDeclarator(node) {
    return node && node.type === 'VariableDeclarator';
}
exports.isVariableDeclarator = isVariableDeclarator;
function isProgram(node) {
    return node && node.type === 'Program';
}
exports.isProgram = isProgram;
function isBlockStatement(node) {
    return node && node.type === 'BlockStatement';
}
exports.isBlockStatement = isBlockStatement;
function isExportNamedDeclaration(node) {
    return node && node.type === 'ExportNamedDeclaration';
}
exports.isExportNamedDeclaration = isExportNamedDeclaration;
function isParenthesizedExpression(node) {
    return node && node.type === 'ParenthesizedExpression';
}
exports.isParenthesizedExpression = isParenthesizedExpression;
function isAssignmentPattern(node) {
    return node && node.type === 'AssignmentPattern';
}
exports.isAssignmentPattern = isAssignmentPattern;
function isThisExpression(node) {
    return node && node.type === 'ThisExpression';
}
exports.isThisExpression = isThisExpression;
function isNegationExpression(node) {
    return node && node.type === 'UnaryExpression' && node.operator === '!';
}
exports.isNegationExpression = isNegationExpression;
