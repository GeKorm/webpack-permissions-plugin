# Webpack Permissions Plugin
A webpack plugin to manage the permissions of output files and directories
Tested with **Webpack 2, 3 and 4**

### Install

- Yarn: `yarn add -D webpack-permissions-plugin`
- Npm: `npm i -D webpack-permissions-plugin`

### Usage

**buildFolders** (*String: path*) The directories to chmod recursively  
**buildFiles** (*String: path*) The specific files to chmod  
  
Files under *buildFolders* get file-specific permissions.

###### Simple: Directories 644, Files 755

```javascript
const PermissionsOutputPlugin = require('webpack-permissions-plugin');

plugins.push(new PermissionsOutputPlugin({
  buildFolders: [
    path.resolve(__dirname, 'resources/'),
    path.resolve(__dirname, 'dist/')
    ],
  buildFiles: [
    path.resolve(__dirname, 'someFile.js'),
    path.resolve(__dirname, 'dist/app.js')
  ]
  // dist/app.js is redundant, it already got 755 by being included in the buildFolder above
}));
```
###### Advanced: Per-path modes

Mode: an octal string or octal integer (eg. `755` or `0o755`)
```javascript
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
  buildFiles: [
    {
      path: path.resolve(__dirname, 'someFile.js'),
      fileMode: '755'
    },
    {
      path: path.resolve(__dirname, 'dist/app.js'),
      fileMode: '777' // Overrides previous dist/ mode
    },
  ]
}));
```
