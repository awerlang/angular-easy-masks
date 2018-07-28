import { uglify } from 'rollup-plugin-uglify';

import pkg from './package.json';

export default [
    {
        input: 'src/module.js',
        output: [
            {
                name: 'wtEasyMask',
                file: pkg.browser,
                format: 'umd'
            },
            {
                file: pkg.module,
                format: 'es'
            },
        ]
    },
    {
        input: 'src/module.js',
        plugins: [
            uglify(),
        ],
        output: [
            {
                file: pkg.browser.replace('.js', '.min.js'),
                format: 'umd',
            },
        ]
    }
];
