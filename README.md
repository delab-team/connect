# DeLab Connect

![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
[![TON](https://img.shields.io/badge/based%20on-TON-blue?style=for-the-badge)](https://ton.org/)
[![npm](https://img.shields.io/npm/v/@delab-team/connect?style=for-the-badge)](https://www.npmjs.com/package/@delab-team/connect)
<a href="https://github.com/delab-team/connect/blob/main/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/delab-team/connect?style=for-the-badge"></a>

Modal package with different TON wallets for React JS.

![example](./example/img/example.png)

## Install

- as local project package
```
yarn add @delab-team/connect
```

## Usage

possible types of event
- `connect`
- `disconnect`
- `error`
- `error-transaction`
- `error-toncoinwallet`
- `error-tonhub`
- `error-tonkeeper`

```typescript
import {
    DeLabModal,
    DeLabButton,
    DeLabConnect,
    DeLabConnecting,
    DeLabTransaction,
    DeLabEvent
} from '@delab-team/connect'

// DeLabConnect must be created outside of the React Component
const DeLabConnector = new DeLabConnect('https://example.com', 'Example', 'mainnet', 'https://yourapp.com/tonconnect_manifest.json')
// - URL your DApp
// - Name your DApp
// - network
// - tonconnect-manifest (optional)

DeLabConnector.on('connect', (event: DeLabEvent) => {
    const connectConfig: DeLabConnecting = event.data
    const trans: DeLabTransaction = {
        to: 'EQCkR1cGmnsE45N4K0otPl5EnxnRakmGqeJUNua5fkWhales',
        value: '1000000' // string value in nano-coins
    }
    const data = await DeLabConnector.sendTransaction(trans)
})

DeLabConnector.on('disconnect', () => {
    console.log('disconect')
})

// Use loadWallet() after the subscriptions are installed
DeLabConnector.loadWallet()
```

DeLabModal must be children of the root React Component
```tsx
// supported scheme: 'light' | 'dark'
<DeLabButton DeLabConnectObject={DeLabConnector} scheme={'dark'} />
// ...
<DeLabModal DeLabConnectObject={DeLabConnector} scheme={'dark'} />
```

# License

[MIT License Copyright (c) 2022 DeLab Team](LICENSE)
