const babelTypes = require('@babel/types');
const babelTemplate = require('@babel/template');

const temp = babelTemplate.default(`module.exports.FUN_NAME = FUN_NAME;`);
const setVariableTemp = babelTemplate.default(`module.exports.FUN_NAME = FUN;`);

module.exports = () => {
  return {
    visitor: {
      FunctionDeclaration(nodePath, pluginPass) {
        const parent = nodePath.parent;
        if ('Program' === parent.type) {
          const funName = nodePath.node.id.name;
          const exportStatement = temp({
            FUN_NAME: babelTypes.identifier(funName)
          });
          nodePath.insertAfter(exportStatement);
        }
      },

      VariableDeclaration(nodePath, state){
        const parent = nodePath.parent;
        const node = nodePath.node;
        if ('Program' === parent.type && node.kind === 'let') {
          const name = node.declarations[0].id.name;
          const exportStatement = setVariableTemp({
            FUN_NAME: babelTypes.identifier(`set${name[0].toUpperCase()}${name.slice(1)}`),
            FUN: babelTypes.functionExpression(
              babelTypes.identifier(`set${name}`),
              [babelTypes.identifier('value')],
              babelTypes.blockStatement(
                [babelTypes.expressionStatement(
                  babelTypes.assignmentExpression(
                    '=',
                    babelTypes.identifier(name),
                    babelTypes.identifier('value')
                  )
                )]
              )
            )
          });
          nodePath.insertAfter(exportStatement);
        }
      }
    }
  }
}