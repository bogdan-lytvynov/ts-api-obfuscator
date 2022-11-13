import * as ts  from "typescript"

export function createTransformer(program: ts.Program) {
  const typeChecker = program.getTypeChecker();

  const transformer = (context: ts.TransformationContext) => {
    return (file: ts.SourceFile) => ts.visitEachChild(file, visit, context);

    function isTelemetryServiceMethodCall(node: ts.Node) {
      if (!(ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression))) {
        return false;
      }

      const propertyAccessExpression = node.expression;
      const {expression: obj, name: methodName} = propertyAccessExpression;

      if (methodName.getText() !== 'startSpan') {
        return false;
      }

      const objectSymbol = typeChecker.getSymbolAtLocation(obj);
      const type = typeChecker.getTypeOfSymbolAtLocation(objectSymbol, objectSymbol.valueDeclaration!);

      if (typeChecker.typeToString(type) !== "TelemetryService") {
        return false;
      }

      return true;
    }

    function visit(node: ts.Node): ts.VisitResult<ts.Node> {
      if (isTelemetryServiceMethodCall(node)) {
        const callExpNode = node as ts.CallExpression;
        const updatedFirstArgument = ts.factory.createStringLiteral("s");
        const newArguments = [
          updatedFirstArgument,
          ...callExpNode.arguments.slice(1)
        ];
        const newNode = ts.factory.createCallExpression(callExpNode.expression, callExpNode.typeArguments, newArguments)
        return newNode
      }

      return ts.visitEachChild(node, visit, context);
    }
  }

  return transformer;
}
