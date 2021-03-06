
import { assert } from '../utils.js'


export function makeifBlock(data, topElementName) {
    let source = [];

    let r = data.value.match(/^#if (.*)$/);
    let exp = r[1];
    assert(exp, 'Wrong binding: ' + data.value);

    let ifBlockName = 'ifBlock' + (this.uniqIndex++);
    source.push(`function ${ifBlockName}($cd, $parentElement) {`);
    let mainBlock, elseBlock;
    if(data.bodyMain) {
        mainBlock = this.buildBlock({body: data.bodyMain});
        elseBlock = this.buildBlock(data);
        source.push(`
            let elsefr = $$htmlToFragment(\`${this.Q(elseBlock.tpl)}\`, true);
            ${elseBlock.source}
        `);
    } else {
        mainBlock = this.buildBlock(data);
    }
    source.push(`
        let mainfr = $$htmlToFragment(\`${this.Q(mainBlock.tpl)}\`, true);
        ${mainBlock.source}
    `);

    if(elseBlock) {
        source.push(`
            $$ifBlock($cd, $parentElement, () => !!(${exp}), mainfr, ${mainBlock.name}, elsefr, ${elseBlock.name});
        `);
    } else {
        source.push(`
            $$ifBlock($cd, $parentElement, () => !!(${exp}), mainfr, ${mainBlock.name});
        `);
    }
    source.push(`};\n ${ifBlockName}($cd, ${topElementName});`);
    
    return {
        source: source.join('\n')
    }
};
