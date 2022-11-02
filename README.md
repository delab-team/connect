# DeLab Connect

![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
[![TON](https://img.shields.io/badge/based%20on-TON-blue?style=for-the-badge)](https://ton.org/)
[![npm](https://img.shields.io/npm/v/@delab-team/connect?style=for-the-badge)](https://www.npmjs.com/package/@delab-team/connect)
[![GitHub license](https://img.shields.io/github/license/delab-team/connect?style=for-the-badge)](https://github.com/delab-team/connect/blob/main/LICENSE)

Package & CLI to generate op's by tl-b

## Install

- as local project package
```
yarn add @delab-team/connect
```

subscribes events
- connect
- disconnect
- approve-link (only tonkeeper)
- error
- error-transaction
- error-toncoinwallet
- error-tonhub
- error-tonkeeper

```typescript
import { 
    DeLabModal, 
    DeLabButton, 
    DeLabConnect, 
    DeLabConnecting, 
    DeLabTransaction, 
    DeLabEvent 
} from '@delab-team/connect'

const DeLabConnector = new DeLabConnect('https://google.com', 'Test', 'mainnet')
// create DeLabConnect only outside the React Component

DeLabConnector.on('connect', (data: DeLabEvent) => {
    const connectConfig: DeLabConnecting = data.data
    const trans: DeLabTransaction = {
        to: 'EQCkR1cGmnsE45N4K0otPl5EnxnRakmGqeJUNua5fkWhales',
        value: '1000000'
    }
    const dataTx2 = await DeLabConnector.sendTransaction(trans)
    if (connectConfig.typeConnect === 'tonkeeper') {
        // code to display qrcode
        console.log('link tonkeeper', dataTx2)
    }
})

DeLabConnector.on('disconnect', () => {
    console.log('disconect')
})

DeLabConnector.loadWallet()
// use loadWallet() after installs subscribes
```

scheme: 'light' | 'dark'

DeLabModal must be children of root React Component
```tsx
    <DeLabButton DeLabConnectObject={DeLabConnector} scheme={'dark'} />
    ...
    <DeLabModal DeLabConnectObject={DeLabConnector} scheme={'dark'} />
```