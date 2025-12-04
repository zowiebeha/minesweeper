import { default as path, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __root_dirname = dirname(fileURLToPath(import.meta.url));

import HtmlWebpackPlugin from 'html-webpack-plugin';

class InlineChunkHtmlPlugin {
    constructor(htmlWebpackPlugin, tests) {
        this.htmlWebpackPlugin = htmlWebpackPlugin;
        this.tests = tests;
    }

    isScript(tag) {
        return tag.tagName === 'script' && tag.attributes && tag.attributes.src;
    }

    isCss(tag) {
        return tag.tagName === 'link' && tag.attributes && tag.attributes.href && tag.attributes.rel === "stylesheet";
    }

    getInlinedTag(publicPath, assets, tag) {
        //debugger;
        const isScript = this.isScript(tag);
        const isCss = this.isCss(tag);
        if (!isScript && !isCss) {
            return tag;
        }

        const href = isScript ? tag.attributes.src : tag.attributes.href;

        const scriptName = publicPath
            ? href.replace(publicPath, '')
            : href;
        if (!this.tests.some(test => scriptName.match(test))) {
            return tag;
        }
        const asset = assets[scriptName];
        if (asset == null) {
            return tag;
        }
        return { tagName: isScript ? 'script' : 'style', innerHTML: asset.source(), closeTag: true };
    }

    apply(compiler) {
        let publicPath = compiler.options.output.publicPath || '';
        if (publicPath && !publicPath.endsWith('/')) {
            publicPath += '/';
        }

        compiler.hooks.compilation.tap('InlineChunkHtmlPlugin', compilation => {
            const tagFunction = tag =>
                this.getInlinedTag(publicPath, compilation.assets, tag);

            const hooks = this.htmlWebpackPlugin.getHooks(compilation);
            hooks.alterAssetTagGroups.tap('InlineChunkHtmlPlugin', assets => {
                assets.headTags = assets.headTags.map(tagFunction);
                assets.bodyTags = assets.bodyTags.map(tagFunction);
            });

            // Still emit the runtime chunk for users who do not use our generated
            // index.html file.
            // hooks.afterEmit.tap('InlineChunkHtmlPlugin', () => {
            //   Object.keys(compilation.assets).forEach(assetName => {
            //     if (this.tests.some(test => assetName.match(test))) {
            //       delete compilation.assets[assetName];
            //     }
            //   });
            // });
        });
    }
}

// for some reason this file and object state is required despite package.json's main key.
export default {
    entry: './src/js/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__root_dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
};