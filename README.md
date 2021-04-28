# Chill

The chill app is an open source end-to-end encrypted messenger.

## Development

### Install

```shell
yarn install
```

### Run

```shell
# Start chill service
chills

# Start app
yarn server
yarn start
```

If you change anything in src/main, you'll need to restart (`yarn start`).
Anything changed in the renderer will be picked up automatically by `yarn server`, you rarely need to restart that.

You can run multiple instances by specifying a different app name and port:

```shell
# Start chill service (as Chill2)
chills -app Chill2 -port 22902

# Start app (Chill2)
yarn server
CHILL_APP=Chill2 CHILL_PORT=22902 yarn start
```
