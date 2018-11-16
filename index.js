const fs = require('fs');
const FileHound = require('filehound');

function PermissionsOutputPlugin(options) {
  this.options = options;
}

PermissionsOutputPlugin.prototype.apply = function(compiler) {
  const changeFilePermissions = () => {
    if (this.options.buildFolders) {
      for (const dir of this.options.buildFolders) {
        const dirs = FileHound.create()
          .path(dir.path || dir)
          .directory()
          .findSync();
        const files = FileHound.create()
          .path(dir.path || dir)
          .not()
          .directory()
          .findSync();
        for (const di of dirs) {
          if (fs.existsSync(di)) {
            fs.chmodSync(di, dir.dirMode || 644);
          }
        }
        for (const fi of files) {
          if (fs.existsSync(fi)) {
            fs.chmodSync(fi, dir.fileMode || 755);
          }
        }
      }
    }
    if (this.options.buildFiles) {
      for (const file of this.options.buildFiles) {
        if (fs.existsSync(file.path || file)) {
          fs.chmodSync(file.path || file, file.fileMode || 755);
        }
      }
    }
  };

  const webpackTap =
    compiler.hooks &&
    compiler.hooks.done &&
    compiler.hooks.done.tap.bind(compiler.hooks.done);

  if (webpackTap) {
    webpackTap('WebpackPermissionsPlugin', changeFilePermissions);
  } else {
    compiler.plugin('done', changeFilePermissions);
  }
};

module.exports = PermissionsOutputPlugin;
