# TypeScript Example

<p>
  <!-- iOS -->
  <img alt="Supports Expo iOS" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff" />
  <!-- Android -->
  <img alt="Supports Expo Android" longdesc="Supports Expo Android" src="https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff" />
  <!-- Web -->
  <img alt="Supports Expo Web" longdesc="Supports Expo Web" src="https://img.shields.io/badge/web-4630EB.svg?style=flat-square&logo=GOOGLE-CHROME&labelColor=4285F4&logoColor=fff" />
</p>

```sh
npx create-react-native-app -t with-typescript
```

TypeScript is a superset of JavaScript which gives you static types and powerful tooling in Visual Studio Code including autocompletion and useful inline warnings for type errors.

## 🚀 How to use

#### Creating a new project

- Install the CLI: `npm i -g expo-cli`
- Create a project: `npx create-react-native-app -t with-typescript`
- `cd` into the project

### Adding TypeScript to existing projects

- Create a blank TypeScript config: `touch tsconfig.json`
- Run `expo start` to automatically configure TypeScript
- Rename files to TypeScript, `.tsx` for React components and `.ts` for plain typescript files

> 💡 You can disable the TypeScript setup in Expo CLI with the environment variable `EXPO_NO_TYPESCRIPT_SETUP=1 expo start`

## 📝 Notes

- [Expo TypeScript guide](https://docs.expo.dev/versions/latest/guides/typescript/)


## How to Build - Local
- npx expo run:android

## How to Build IOS - Deploy
- eas build -p ios --profile production

## How to Build APK - Deploy
- eas build -p android --profile production

## How to Build APK - Local
- eas build -p android --local --profile production

## How to Build - Local - Production 
- npx expo run:android --variant release

## How to Build - Prod
- eas build -p android --profile production_deploy

## How to Deploy - Prod - Android
- npx eas submit -p android

## How to run language translation validation
- ts-node --esm ./scripts/compareLanguages.ts 
- change the comparison by updating params in console.log

## Compile error checklist
- Run npm i
- Delete node_modules and run npm i
- Delete android/app/build directory

## How to update version
- package.json version
- app.json version
- android/app/build.gradle version
- android/app/build.gradle versionCode
Versions should all be the same value. 
VersionCode should increment by 1

## How to clear cache
- npm i 
- npx expo start -c
