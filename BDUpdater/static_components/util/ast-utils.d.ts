import { AssignmentPattern, ArrayExpression, BlockStatement, CallExpression, ExportNamedDeclaration, ExpressionStatement, FunctionExpression, FunctionDeclaration, Identifier, ImportSpecifier, ImportDeclaration, MemberExpression, NewExpression, ObjectExpression, ObjectPattern, SimpleCallExpression, SimpleLiteral, ThisExpression, ArrowFunctionExpression, AssignmentExpression, SpreadElement, Program, Property, TemplateLiteral, VariableDeclarator } from 'estree';
/**
 * Represents both constructor and non-constructor calls
 * @param expr
 */
export declare function isCallExpression(expr: any): expr is CallExpression;
/**
 * Represents all constructor calls
 * @param expr
 */
export declare function isNewExpression(expr: any): expr is NewExpression;
/**
 * Represents all non-constructor calls
 * @param expr
 */
export declare function isSimpleCallExpression(expr: any): expr is SimpleCallExpression;
/**
 * Represents property reads
 * @param node
 */
export declare function isMemberExpression(node: any): node is MemberExpression;
export declare function isAssignmentExpression(node: any): node is AssignmentExpression;
/**
 * Represents identifier nodes, e.g., 'o' and 'p' in o.p
 * @param node
 */
export declare function isIdentifier(node: any): node is Identifier;
export declare function isImportSpecifier(node: any): node is ImportSpecifier;
export declare function isImportDefaultSpecifier(node: any): node is ImportSpecifier;
export declare function isImportNamespaceSpecifier(node: any): node is ImportSpecifier;
/**
 * returns true if node represents a non-regex literal
 * @param node
 */
export declare function isSimpleLiteral(node: any): node is SimpleLiteral;
export declare function isFunctionExpression(node: any): node is FunctionExpression;
export declare function isArrowFunctionExpression(node: any): node is ArrowFunctionExpression;
export declare function isFunctionDeclaration(node: any): node is FunctionDeclaration;
export declare function isAnyCreateFunctionNode(node: any): boolean;
export declare function isObjectExpression(node: any): node is ObjectExpression;
export declare function isArrayExpression(node: any): node is ArrayExpression;
export declare function isTemplateLiteral(node: any): node is TemplateLiteral;
export declare function isObjectPattern(node: any): node is ObjectPattern;
export declare function isSpreadElement(node: any): node is SpreadElement;
export declare function isImportDeclaration(node: any): node is ImportDeclaration;
export declare function isProperty(node: any): node is Property;
export declare function isRequireCall(node: any): node is SimpleCallExpression;
export declare function isModuleImport(n: any): boolean;
export declare function isExpressionStatement(node: any): node is ExpressionStatement;
export declare function isVariableDeclarator(node: any): node is VariableDeclarator;
export declare function isProgram(node: any): node is Program;
export declare function isBlockStatement(node: any): node is BlockStatement;
export declare function isExportNamedDeclaration(node: any): node is ExportNamedDeclaration;
export declare function isParenthesizedExpression(node: any): any;
export declare function isAssignmentPattern(node: any): node is AssignmentPattern;
export declare function isThisExpression(node: any): node is ThisExpression;
export declare function isNegationExpression(node: any): boolean;
