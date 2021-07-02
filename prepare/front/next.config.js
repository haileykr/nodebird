// require("dotenv").config(); //then we can manipulate env settings
// or you can run script like "scripts" : "build" : "ANALYZE=true NODE_ENV=production next build" ~> settings for each run! 
// but!! this doesn't run on windows
// thus install cross-env

const withBundleAnalyzer = require("@next/bundle-analyzer") ({
    enabled: process.env.ANALYZE=== "true",
});

module.exports = withBundleAnalyzer({
    compress: true,

    webpack(config, {webpack}){
        const prod = process.env.NODE_ENV ==='production';
        const plugins = [
            ...config.plugins,
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/ , /^\.\/ko$/),
        ]; 

        // if (prod) {
        //     plugins.push(new CompressPlugin()); //from compression-webpack-plugin: is now built-in!
        // }//creates gzip files
        
        return {
            ...config,
            mode: prod ? 'production':'development',
            devtool: prod ? 'hidden-source-map': 'eval',
            plugins,
            // module: {//if wanna change modules!
            //     ...config.module,
            //     rules : [
            //         ...config.module.rules,
            //         {

            //         }
            //     ],
            // }
        };
    }
});