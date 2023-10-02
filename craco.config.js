const path = require("path");
const cracoWasm = require("craco-wasm");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    plugins: [cracoWasm()],
    webpack: {
        configure: (webpackConfig, {env, paths}) => {
            if (process.env.EDIT_MODE) {
                webpackConfig.entry = path.resolve(__dirname, "src/edit.tsx");
                webpackConfig.output.path = path.resolve(__dirname, "edit/web");
                paths.appBuild = path.resolve(__dirname, "edit/web");

                // Update the CleanWebpackPlugin configuration
                const cleanWebpackPlugin = webpackConfig.plugins.find(plugin => plugin instanceof CleanWebpackPlugin);
                if (cleanWebpackPlugin) {
                    cleanWebpackPlugin.options.cleanOnceBeforeBuildPatterns = [path.resolve(__dirname, 'edit/web/**/*')];
                }
            }

            return webpackConfig;
        }
    }
}
