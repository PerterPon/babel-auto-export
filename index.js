
const babelTypes = require('@babel/types');
const babelTemplate = require('@babel/template');

const temp = babelTemplate.default(`module.exports.FUN_NAME = FUN_NAME;`);

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
      }
    }
  }
}
