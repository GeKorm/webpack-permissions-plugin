const fs = require('fs');
const FileHound = require('filehound');

function PermissionsOutputPlugin(options) {
  this.options = options;
}
const b = 0o755;

PermissionsOutputPlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', () => {
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
          fs.chmodSync(di, dir.dirMode || 644);
        }
        for (const fi of files) {
          fs.chmodSync(fi, dir.fileMode || 755);
        }
      }
    }
    if (this.options.buildFiles) {
      for (const file of this.options.buildFiles) {
        fs.chmodSync(file.path || file, file.fileMode || 755);
      }
    }
  });
};
