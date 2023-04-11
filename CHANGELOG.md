# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.37](https://gitlab.coko.foundation/cokoapps/client/compare/v0.0.36...v0.0.37) (2023-04-11)


### Bug Fixes

* reinstate current user undefined check in RequireAuth ([da7b312](https://gitlab.coko.foundation/cokoapps/client/commit/da7b312e594c39df928a6b10f841d4f54504232e))

### [0.0.36](https://gitlab.coko.foundation/cokoapps/client/compare/v0.0.35...v0.0.36) (2023-04-10)


### Bug Fixes

* **components:** undo wrap root with authenticate, it hardcodes cu query ([e5fff79](https://gitlab.coko.foundation/cokoapps/client/commit/e5fff79cdf36764bbafdf8b44a90967098e7e74b))

### [0.0.35](https://gitlab.coko.foundation/cokoapps/client/compare/v0.0.34...v0.0.35) (2023-04-06)


### Features

* disconnect current user check from requiring authentication ([7505fe3](https://gitlab.coko.foundation/cokoapps/client/commit/7505fe380e1f95ec57fa21ecba6e7ff1b7dc52ae))

### [0.0.34](https://gitlab.coko.foundation/cokoapps/client/compare/v0.0.33...v0.0.34) (2023-01-23)


### Features

* replace server protocol, port and host with a single serverUrl variable ([bb8489c](https://gitlab.coko.foundation/cokoapps/client/commit/bb8489c7c8f46cef7ef77f21ecdcedfb59e94bd4))

### [0.0.33](https://gitlab.coko.foundation///compare/v0.0.32...v0.0.33) (2022-12-22)

### Bug Fixes

- **components:** pass font size variable pixel numbers to ant correctly ([2867a32](https://gitlab.coko.foundation///commit/2867a3267dfebaeaf72ccedff948bac9bc6fe6dd))

### [0.0.32](https://gitlab.coko.foundation///compare/v0.0.29...v0.0.32) (2022-12-21)

### Features

- upgrade antd to version 5 ([5e329a5](https://gitlab.coko.foundation///commit/5e329a5c2f280b08dfa1b17c97ef6859511dfd1a))
- **webpack:** add lang attribute to html, read from env, default en-US ([926dce3](https://gitlab.coko.foundation///commit/926dce35113134769c2c00842ce01ce0c3bb9a56))
- **webpack:** add viewport meta tag to optimize sites for mobile ([85a019c](https://gitlab.coko.foundation///commit/85a019c426dbca3fc9802ffb94fe6ad2b76c7997))
- **webpack:** handle .svg files in the webpack config ([56a947f](https://gitlab.coko.foundation///commit/56a947f04e9f3e6bbf0ae22ba4d825d2eb5a3d42))

### Bug Fixes

- fix getUrl process imports so that it works with webpack 5 ([1dec0f5](https://gitlab.coko.foundation///commit/1dec0f5126f5907c06207db734861534eff30608))
- **webpack:** remove quotation marks from lang attr ([6ee6c2c](https://gitlab.coko.foundation///commit/6ee6c2ce8ab8b47a5a9236213dd7e7c60abdcf58))

### [0.0.31](https://gitlab.coko.foundation///compare/v0.0.30...v0.0.31) (2022-09-01)

### Bug Fixes

- fix getUrl process imports so that it works with webpack 5 ([954e745](https://gitlab.coko.foundation///commit/954e745c2c46d1a184237e53249e006fbddabec3))

### [0.0.30](https://gitlab.coko.foundation///compare/v0.0.29...v0.0.30) (2022-07-14)

### Features

- **webpack:** add lang attribute to html, read from env, default en-US ([926dce3](https://gitlab.coko.foundation///commit/926dce35113134769c2c00842ce01ce0c3bb9a56))
- **webpack:** handle .svg files in the webpack config ([8880c01](https://gitlab.coko.foundation///commit/8880c01e2bb6c234d53521777ce0a9119522eafd))

### [0.0.29](https://gitlab.coko.foundation///compare/v0.0.28...v0.0.29) (2022-07-06)

### Features

- allow passing of apollo config function ([def2ecf](https://gitlab.coko.foundation///commit/def2ecfa12fe413a6323c9d261a0ed36a9fdf37c))

### [0.0.28](https://gitlab.coko.foundation///compare/v0.0.27...v0.0.28) (2022-06-26)

### Bug Fixes

- **components:** make nav component in layout optional ([ca8aaa4](https://gitlab.coko.foundation///commit/ca8aaa47a3122bc355dbacf15bcfa6fd2c656d3f))

### [0.0.27](https://gitlab.coko.foundation///compare/v0.0.26...v0.0.27) (2022-06-26)

### Bug Fixes

- **components:** fix require auth user query prop type ([47a4ab2](https://gitlab.coko.foundation///commit/47a4ab2e10320484a9d9705209dd6d52ba3e4753))
- **components:** pass classname prop to page layout ([5f8d32c](https://gitlab.coko.foundation///commit/5f8d32c1d1e487131d7839715fdc978cb5e2325f))

### [0.0.26](https://gitlab.coko.foundation///compare/v0.0.25...v0.0.26) (2022-05-29)

### Features

- **components:** allow custom current user query ([6240412](https://gitlab.coko.foundation///commit/62404123ff450d5500f39fb74ef0ffc5703269fe))

### [0.0.25](https://gitlab.coko.foundation///compare/v0.0.24...v0.0.25) (2022-05-28)

### Features

- **components:** handle correct login but identity not verified ([6f8b8c1](https://gitlab.coko.foundation///commit/6f8b8c1626e381e02399e05bc0034763339ac438))

### [0.0.24](https://gitlab.coko.foundation///compare/v0.0.23...v0.0.24) (2022-05-28)

### Features

- **components:** add require auth component ([13dd1e6](https://gitlab.coko.foundation///commit/13dd1e6137ed24932a921ecfb26db6b795fbe0f2))

### [0.0.23](https://gitlab.coko.foundation///compare/v0.0.22...v0.0.23) (2021-07-19)

### [0.0.22](https://gitlab.coko.foundation///compare/v0.0.21...v0.0.22) (2021-07-19)

### Bug Fixes

- **webpack:** add babel plugin transform runtime ([6199971](https://gitlab.coko.foundation///commit/6199971889ee3556f4cd6f95a433d2221d1817a6))

### [0.0.21](https://gitlab.coko.foundation///compare/v0.0.20...v0.0.21) (2021-07-15)

### Bug Fixes

- **theme:** fix dynamic theme loading of ant vars ([780ef8a](https://gitlab.coko.foundation///commit/780ef8a77452683a4a10f7a742ba173c24952907))

### [0.0.20](https://gitlab.coko.foundation///compare/v0.0.19...v0.0.20) (2021-07-14)

### Bug Fixes

- move antd to dependencies ([72a09dc](https://gitlab.coko.foundation///commit/72a09dc778d2d7c98a348148e374e7ef8dea173e))

### [0.0.19](https://gitlab.coko.foundation///compare/v0.0.18...v0.0.19) (2021-06-09)

### Features

- **theme:** remove theme from env vars ([7bd0c7e](https://gitlab.coko.foundation///commit/7bd0c7eb870c5a3467b99b81e97f8eeb72a56a63))

### [0.0.18](https://gitlab.coko.foundation///compare/v0.0.17...v0.0.18) (2021-06-08)

### [0.0.17](https://gitlab.coko.foundation///compare/v0.0.16...v0.0.17) (2021-06-08)

### Features

- **webpack:** less variable live reloading ([a43e30e](https://gitlab.coko.foundation///commit/a43e30e172fcde23230308ee597dc804e246a3ec))

### [0.0.16](https://gitlab.coko.foundation///compare/v0.0.15...v0.0.16) (2021-06-08)

### [0.0.15](https://gitlab.coko.foundation///compare/v0.0.14...v0.0.15) (2021-06-08)

### [0.0.14](https://gitlab.coko.foundation///compare/v0.0.13...v0.0.14) (2021-06-08)

### [0.0.13](https://gitlab.coko.foundation///compare/v0.0.12...v0.0.13) (2021-05-08)

### Features

- export ui toolkit helpers ([b58da8b](https://gitlab.coko.foundation///commit/b58da8b75f8263557664cd108c52e5733bd9ff5d))

### [0.0.12](https://gitlab.coko.foundation///compare/v0.0.11...v0.0.12) (2021-05-08)

### Features

- **webpack:** add antd support ([6426fdd](https://gitlab.coko.foundation///commit/6426fdd1d710c250c58637c2845428c8ed8566c4))

### [0.0.11](https://gitlab.coko.foundation///compare/v0.0.10...v0.0.11) (2021-05-05)

### Bug Fixes

- **webpack:** correct known environment variables list ([17abc46](https://gitlab.coko.foundation///commit/17abc46ab63a59eacfa96bda20807d493441a8c5))
- **webpack:** fix webpack fast refresh dnd issue ([2ab0790](https://gitlab.coko.foundation///commit/2ab0790dbc2997886cd3affd30227873643f489f))

### [0.0.10](https://gitlab.coko.foundation///compare/v0.0.9...v0.0.10) (2021-04-18)

### Bug Fixes

- **webpack:** do not use depecrated url-loader in config ([f541a19](https://gitlab.coko.foundation///commit/f541a19edace3ada8f2bdbb7a58bdd7fc0b79401))
- **webpack:** make fast-refresh opt-in ([9072727](https://gitlab.coko.foundation///commit/90727271503f23e0fa4acbbf0c76c7a7f8648ef1))

### [0.0.9](https://gitlab.coko.foundation///compare/v0.0.8...v0.0.9) (2021-04-15)

### Bug Fixes

- **webpack:** fix clashing dependencies ([0c18063](https://gitlab.coko.foundation///commit/0c18063aacb3d55e564306025bb43b075e7a1a3b))

### [0.0.8](https://gitlab.coko.foundation///compare/v0.0.7...v0.0.8) (2021-04-12)

### Features

- add react fast refresh to webpack ([603e34f](https://gitlab.coko.foundation///commit/603e34f1a49f8bc00d70d78c01156464c25c2dbd))
- webpack in client first attempt ([f0de968](https://gitlab.coko.foundation///commit/f0de968683c5e21b5ce4f8a3705611e6254acbaf))
- **theme:** add colorDisabled variable ([91267e5](https://gitlab.coko.foundation///commit/91267e5074fd96b9ec3e9983aa8be1c4c00c37d3))
- **webpack:** fix production build ([96de23a](https://gitlab.coko.foundation///commit/96de23a198ece7b73b8e00146ba3d9c6eb662766))

### Bug Fixes

- do not compile webpack and scripts folders ([7a0f5ee](https://gitlab.coko.foundation///commit/7a0f5eea140cbdb882b702c523d9eec9bfd14333))
- **webpack:** add ouput section to config ([91dc3d6](https://gitlab.coko.foundation///commit/91dc3d6489ea5111d2feb07d19dec6c98c831b71))
- **webpack:** use babel config instead of babelrc ([779c11b](https://gitlab.coko.foundation///commit/779c11b508def724cf0e60236bbbb649daf41e4f))

### [0.0.7](https://gitlab.coko.foundation///compare/v0.0.6...v0.0.7) (2021-01-10)

### Features

- **components:** make page padding and fade in optional ([51f5747](https://gitlab.coko.foundation///commit/51f57477ec0b738ba74d180ab5ce6f0e33f5a41d))

### [0.0.6](https://gitlab.coko.foundation///compare/v0.0.5...v0.0.6) (2021-01-09)

### Features

- publish transpiled code ([49a78f3](https://gitlab.coko.foundation///commit/49a78f303c16dcfb4280d7059812d83cc9b438d7))

### [0.0.5](https://gitlab.coko.foundation///compare/v0.0.4...v0.0.5) (2021-01-09)

### Features

- **components:** add layout with navigation bar component ([4edfc39](https://gitlab.coko.foundation///commit/4edfc390033ced217f1f29731fbd122f440717fc))

### [0.0.4](https://gitlab.coko.foundation///compare/v0.0.3...v0.0.4) (2020-11-08)

### Bug Fixes

- **theme:** remove breaking animation ([343be99](https://gitlab.coko.foundation///commit/343be9935350e25b67826157dccec5db3f616229))

### [0.0.3](https://gitlab.coko.foundation///compare/v0.0.2...v0.0.3) (2020-11-01)

### Features

- **theme:** export theme ([87837ba](https://gitlab.coko.foundation///commit/87837badf3d4df3e25b683dee89e92db2c3fbec3))

### 0.0.2 (2020-11-01)

### Features

- **theme:** add theme variables and overrides ([06456af](https://gitlab.coko.foundation///commit/06456af9df6c758768744bd366d57a586b16bed3))
