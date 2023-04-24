"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.createTransformer = void 0;
var ts = require("typescript");
function createTransformer(program) {
    var typeChecker = program.getTypeChecker();
    var transformer = function (context) {
        return function (file) { return ts.visitEachChild(file, visit, context); };
        function isTelemetryServiceMethodCall(node) {
            if (!(ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression))) {
                return false;
            }
            var propertyAccessExpression = node.expression;
            var obj = propertyAccessExpression.expression, methodName = propertyAccessExpression.name;
            if (methodName.getText() !== 'startSpan') {
                return false;
            }
            var objectSymbol = typeChecker.getSymbolAtLocation(obj);
            var type = typeChecker.getTypeOfSymbolAtLocation(objectSymbol, objectSymbol.valueDeclaration);
            if (typeChecker.typeToString(type) !== "TelemetryService") {
                return false;
            }
            return true;
        }
        function visit(node) {
            if (isTelemetryServiceMethodCall(node)) {
                var callExpNode = node;
                var updatedFirstArgument = ts.factory.createStringLiteral("s");
                var newArguments = __spreadArray([
                    updatedFirstArgument
                ], callExpNode.arguments.slice(1), true);
                var newNode = ts.factory.createCallExpression(callExpNode.expression, callExpNode.typeArguments, newArguments);
                return newNode;
            }
            return ts.visitEachChild(node, visit, context);
        }
    };
    return transformer;
}
exports.createTransformer = createTransformer;
