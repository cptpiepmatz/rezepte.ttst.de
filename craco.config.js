const path = require("path");
const cracoWasm = require("craco-wasm");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

process.env.BROWSER = "none";
process.env.PORT = process.env.EDIT_MODE ? "3000" : "3001";

module.exports = {
    plugins: [cracoWasm()],
    webpack: {
        configure: (webpackConfig, {env, paths}) => {
            if (process.env.EDIT_MODE) {
                webpackConfig.entry = path.resolve(__dirname, "src/edit/index.tsx");
                webpackConfig.output.path = path.resolve(__dirname, "edit/web");
                paths.appBuild = path.resolve(__dirname, "edit/web");

                // Update the CleanWebpackPlugin configuration
                const cleanWebpackPlugin = webpackConfig
                    .plugins
                    .find(plugin => plugin instanceof CleanWebpackPlugin);

                if (cleanWebpackPlugin) {
                    cleanWebpackPlugin.options.cleanOnceBeforeBuildPatterns =
                        [path.resolve(__dirname, 'edit/web/**/*')];
                }
            }

            env.BROWSER = "none";
            return webpackConfig;
        }
    }
}
