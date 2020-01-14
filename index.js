const fs = require('fs');
const FileHound = require('filehound');

const pluginName = 'WebpackPermissionsPlugin';

const warn = (logger, path) => {
  const errorMessage = `Directory not found ${path}`;
  if (logger) {
    logger.warn(errorMessage);
  } else {
    console.warn(`WebpackPermissionsPlugin: ${errorMessage}`);
  }
};

function PermissionsOutputPlugin(options) {
  this.options = options;
}

PermissionsOutputPlugin.prototype.apply = function(compiler) {
  const changeFilePermissions = () => {
    const logger =
      compiler.getInfrastructureLogger &&
      compiler.getInfrastructureLogger(pluginName);

    if (this.options.buildFolders) {
      for (const dir of this.options.buildFolders) {
        const path = dir.path || dir;
        if (!fs.existsSync(dir)) {
          warn(logger, path);
          return;
        }

        const dirs = FileHound.create()
          .path(path)
          .directory()
          .findSync();
        const files = FileHound.create()
          .path(path)
          .not()
          .directory()
          .findSync();
        for (const di of dirs) {
          if (fs.existsSync(di)) {
            fs.chmodSync(di, dir.dirMode || 0o644);
          }
        }
        for (const fi of files) {
          if (fs.existsSync(fi)) {
            fs.chmodSync(fi, dir.fileMode || 0o755);
          }
        }
      }
    }
    if (this.options.buildFiles) {
      for (const file of this.options.buildFiles) {
        if (fs.existsSync(file.path || file)) {
          fs.chmodSync(file.path || file, file.fileMode || 0o755);
        }
      }
    }
  };

  const webpackTap =
    compiler.hooks &&
    compiler.hooks.done &&
    compiler.hooks.done.tap.bind(compiler.hooks.done);

  if (webpackTap) {
    webpackTap(pluginName, changeFilePermissions);
  } else {
    compiler.plugin('done', changeFilePermissions);
  }
};

module.exports = PermissionsOutputPlugin;
