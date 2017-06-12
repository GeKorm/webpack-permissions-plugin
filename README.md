# Webpack Permissions Plugin
A webpack plugin to manage the permissions of output files and directories

### Usage

1. Install:
    - Yarn: `yarn add -D webpack-permissions-plugin`
    - Npm: `npm i -D webpack-permissions-plugin`

###### Simple: Directories 644, Files 755

```ecmascript 6
const PermissionsOutputPlugin = require('webpack-permissions-plugin');

plugins.push(new PermissionsOutputPlugin({
  buildFolders: [path.resolve(__dirname, 'resources/'), path.resolve(__dirname, 'dist/')],
  buildFiles: [path.resolve(__dirname, 'someFile.js'), path.resolve(__dirname, 'dist/app.js')]
}));
```
###### Advanced: Per-path modes

Mode: an octal string or octal integer ('755' or 0o755)
```ecmascript 6
const PermissionsOutputPlugin = require('webpack-permissions-plugin');

plugins.push(new PermissionsOutputPlugin({
  buildFolders: [
    {
      path: path.resolve(__dirname, 'resources/'), // Everything under resources/ gets these modes
      fileMode: '755',
      dirMode: '644'
    },
    {
      path: path.resolve(__dirname, 'dist/'), // Everything under dist/ gets these modes
      fileMode: '755',
      dirMode: '644'
    }
  ],
  // buildFiles can override buildFolders modes
  buildFiles: [
    {
      path: path.resolve(__dirname, 'someFile.js'), // Everything under resources/ gets these modes
      fileMode: '755'
    },
    {
      path: path.resolve(__dirname, 'dist/app.js'), // Everything under resources/ gets these modes
      fileMode: '777' // Overrides previous dist/ modes
    },
  ]
}));
```
