const CSS_RULE_NAME_REGEX = /^[.#][^\s{]+/gm;
const CSS_RULE_NAME_SPECIAL_CHARS = /[.#]/g;

module.exports = {
  process(src) {
    const presentCssRuleNames = src.match(CSS_RULE_NAME_REGEX) ?? [];
    const outputModule = {};

    for (const cssRuleName of presentCssRuleNames) {
      const inRecordName = cssRuleName.replace(CSS_RULE_NAME_SPECIAL_CHARS, '');

      if (inRecordName.includes(':')) {
        continue;
      }

      outputModule[inRecordName] = inRecordName;
    }

    return {
      code: `module.exports = ${JSON.stringify(outputModule)};`,
    };
  },
};
