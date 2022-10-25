import { validator } from 'express-validator';
import { check } from 'express-validator/check';

module.exports.add = [
    check('title').custom(value => {
      for(let charIdx = 0; charIdx < value.length; charIdx += 1) {
          if (!validator.isAlpha(value[charIdx], 'en-US')
           && !validator.isAlpha(value[charIdx], 'el-GR')) {
            throw new Error('Illegal title'); 
          }   
      }

      return true;
    })
];

