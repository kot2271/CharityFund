# CharityFund

## Задача:
Реализовать смарт-контракт благотворительного фонда.
Пользователи могут вносить средства на контракт, а владелец, позже, сможет их перевести куда-либо.
## Критерии:
Для всех проверок использовать вместо require и assert, кастомные ошибки и конструкции типа if(условие) revert customError();

Избегать циклы при изменении состояния блокчейна.

## Installation

Clone the repository using the following command:
Install the dependencies using the following command:
```shell
npm i
```

## Deployment

Fill in all the required environment variables(copy .env-example to .env and fill it). 

Deploy contract to the chain (polygon-mumbai):
```shell
npx hardhat run scripts/deploy.ts --network polygonMumbai
```

## Verify

Verify the installation by running the following command:
```shell
npx hardhat verify --network polygonMumbai {CONTRACT_ADDRESS}
```

## Tasks

Create a new task(s) and save it(them) in the folder "tasks". Add a new task_name in the file "tasks/index.ts"

Running a donate task:
```shell
npx hardhat donate --contract {CONTRACT_ADDRESS} --value {AMOUNT} --network polygonMumbai
```

Running a sendHelp task:
```shell
npx hardhat sendHelp --contract {CONTRACT_ADDRESS} --recipient {RECIPIENT_ADDRESS} --amount {AMOUNT} --network polygonMumbai
```

Running a getDonators task:
```shell
npx hardhat getDonators --contract {CONTRACT_ADDRESS} --network polygonMumbai
```

Running a getSumOfDonations task:
```shell
npx hardhat getSumOfDonations --contract {CONTRACT_ADDRESS} --network polygonMumbai
```

```shell
{CONTRACT_ADDRESS}: 0xC5C630A30D5dc7A3Ae040B3Db627D534f7DE94F8
```
