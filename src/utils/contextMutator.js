/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */
class ContextMutator {
  static addVariableToContext(context, variable) {
    if (context && context.hasOwnProperty(variable.name)) {
      if (context.hasOwnProperty(`${variable.name}_1`)) {
        const [, index] = Object.keys(context)
          .map(k => (k.indexOf('_') ? k : null))
          .filter(v => v)
          .reverse()[0]
          .split('_');
        context[`${variable.name}_${Number(index) + 1}`] = variable.value;
      } else {
        context[`${variable.name}_1`] = variable.row || variable.value;
      }
    } else {
      context[variable.name] = variable.row || variable.value;
    }
  }

  static addEntityToContext(context, entity) {
    if (context && context[entity.name]) {
      if (context[`${entity.name}_1`]) {
        const [, index] = Object.keys(context)
          .map(k => (k.indexOf('_') ? k : null))
          .filter(v => v)
          .reverse()[0]
          .split('_');
        context[`${entity.name}_${Number(index) + 1}`] = entity.row || entity.match;
      } else {
        context[`${entity.name}_1`] = entity.row || entity.match;
      }
    } else {
      context[entity.name] = entity.row || entity.match;
    }
  }
}

module.exports = ContextMutator;
