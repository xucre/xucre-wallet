
import {
  HARDHAT_PORT,
  HARDHAT_PRIVATE_KEY, 
  REACT_APP_CHAIN_ID,
  REACT_APP_CHAIN_RPC_URL_MUMBAI,
  REACT_APP_EVENT_QUERY_URL,
  REACT_APP_IPFS_GATEWAY,
  REACT_APP_MULTICALL_ADDRESS,
  REACT_APP_MULTICALL_MUMBAI,
  REACT_APP_NEW_MESSAGE_JSON,
  REACT_APP_NEW_POST_JSON,
  REACT_APP_NFT_STORAGE_API_KEY,
  REACT_APP_NODE_ENV,
  REACT_APP_OPENSEA_TEST_URL,
  REACT_APP_PROFILE_SET_JSON,
  REACT_APP_TOKEN_ADDRESS,
  REACT_APP_TOKEN_ADDRESS_MUMBAI,
  REACT_APP_USER_SETTING_QUERY_URL,
  REACT_APP_USER_SETTING_URL,
  REACT_APP_WALLET_CONNECT_PROJECT_ID,
  REACT_APP_WALLET_CONNECT_RELAY_URL,
  REACT_APP_WORKSMANAGER_ADDRESS,
  REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI, 
  REACT_APP_XUCRE_ADDRESS,
  REACT_APP_XUCRE_WALLET_SCHEME,
} from '@env';

export const env = {
  HARDHAT_PORT: process.env.HARDHAT_PORT || HARDHAT_PORT,
  HARDHAT_PRIVATE_KEY: process.env.HARDHAT_PRIVATE_KEY || HARDHAT_PRIVATE_KEY,
  REACT_APP_CHAIN_ID : process.env.REACT_APP_CHAIN_ID || REACT_APP_CHAIN_ID,
  REACT_APP_CHAIN_RPC_URL_MUMBAI: process.env.REACT_APP_CHAIN_RPC_URL_MUMBAI || REACT_APP_CHAIN_RPC_URL_MUMBAI,
  REACT_APP_EVENT_QUERY_URL: process.env.REACT_APP_EVENT_QUERY_URL || REACT_APP_EVENT_QUERY_URL,
  REACT_APP_IPFS_GATEWAY: process.env.REACT_APP_IPFS_GATEWAY || REACT_APP_IPFS_GATEWAY,
  REACT_APP_MULTICALL_ADDRESS : process.env.REACT_APP_MULTICALL_ADDRESS || REACT_APP_MULTICALL_ADDRESS,
  REACT_APP_MULTICALL_MUMBAI : process.env.REACT_APP_MULTICALL_MUMBAI || REACT_APP_MULTICALL_MUMBAI,
  REACT_APP_NEW_MESSAGE_JSON : process.env.REACT_APP_NEW_MESSAGE_JSON || REACT_APP_NEW_MESSAGE_JSON,
  REACT_APP_NEW_POST_JSON : process.env.REACT_APP_NEW_POST_JSON || REACT_APP_NEW_POST_JSON,
  REACT_APP_NFT_STORAGE_API_KEY: process.env.REACT_APP_NFT_STORAGE_API_KEY || REACT_APP_NFT_STORAGE_API_KEY,
  REACT_APP_NODE_ENV: process.env.REACT_APP_NODE_ENV || REACT_APP_NODE_ENV,
  REACT_APP_OPENSEA_TEST_URL: process.env.REACT_APP_OPENSEA_TEST_URL || REACT_APP_OPENSEA_TEST_URL,
  REACT_APP_PROFILE_SET_JSON : process.env.REACT_APP_PROFILE_SET_JSON || REACT_APP_PROFILE_SET_JSON,
  REACT_APP_TOKEN_ADDRESS : process.env.REACT_APP_TOKEN_ADDRESS || REACT_APP_TOKEN_ADDRESS,
  REACT_APP_TOKEN_ADDRESS_MUMBAI : process.env.REACT_APP_TOKEN_ADDRESS_MUMBAI || REACT_APP_TOKEN_ADDRESS_MUMBAI,
  REACT_APP_USER_SETTING_QUERY_URL : process.env.REACT_APP_USER_SETTING_QUERY_URL || REACT_APP_USER_SETTING_QUERY_URL,
  REACT_APP_USER_SETTING_URL: process.env.REACT_APP_USER_SETTING_URL || REACT_APP_USER_SETTING_URL,
  REACT_APP_WALLET_CONNECT_PROJECT_ID: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || REACT_APP_WALLET_CONNECT_PROJECT_ID,
  REACT_APP_WALLET_CONNECT_RELAY_URL: process.env.REACT_APP_WALLET_CONNECT_RELAY_URL || REACT_APP_WALLET_CONNECT_RELAY_URL,
  REACT_APP_WORKSMANAGER_ADDRESS : process.env.REACT_APP_WORKSMANAGER_ADDRESS || REACT_APP_WORKSMANAGER_ADDRESS,
  REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI : process.env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI || REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI,
  REACT_APP_XUCRE_ADDRESS: process.env.REACT_APP_XUCRE_ADDRESS || REACT_APP_XUCRE_ADDRESS,
  REACT_APP_XUCRE_WALLET_SCHEME: process.env.REACT_APP_XUCRE_WALLET_SCHEME || REACT_APP_XUCRE_WALLET_SCHEME,
}

export const routes = {
  "account-detail" : "/account",
  "channel-create" : "/newChannel",
  "channel-detail" : "/channel/",
  "channel-list" : "/manage",
};

export const basicSvg = {
  svgPartOne : '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="2250" viewBox="0 0 2250 2250" height="2250" version="1.0"> <style> @import url("https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i"); </style> <defs> <clipPath id="b"> <path d="M 0.5 0 L 2249.5 0 L 2249.5 2249 L 0.5 2249 Z M 0.5 0" /> </clipPath> <clipPath id="e"> <path d="M 0.5 0 L 2249.351562 0 L 2249.351562 2249 L 0.5 2249 Z M 0.5 0" /> </clipPath> <clipPath id="d"> <path d="M0 0H2250V2249H0z" /> </clipPath> <clipPath id="g"> <path d="M 567.492188 566.992188 L 1682.140625 566.992188 L 1682.140625 1681.640625 L 567.492188 1681.640625 Z M 567.492188 566.992188" /> </clipPath> <clipPath id="h"> <path d="M 1124.816406 1681.640625 C 817.761719 1681.640625 567.492188 1431.371094 567.492188 1124.316406 C 567.492188 817.261719 817.761719 566.992188 1124.816406 566.992188 C 1431.871094 566.992188 1682.140625 817.261719 1682.140625 1124.316406 C 1682.140625 1431.371094 1431.871094 1681.640625 1124.816406 1681.640625 Z M 1124.816406 672.148438 C 875.597656 672.148438 672.648438 875.097656 672.648438 1124.316406 C 672.648438 1373.535156 875.597656 1576.488281 1124.816406 1576.488281 C 1374.035156 1576.488281 1576.984375 1373.535156 1576.984375 1124.316406 C 1576.984375 875.097656 1374.035156 672.148438 1124.816406 672.148438 Z M 1124.816406 672.148438" /> </clipPath> <clipPath id="j"> <path d="M 1004.199219 841 L 1245.632812 841 L 1245.632812 1409 L 1004.199219 1409 Z M 1004.199219 841" /> </clipPath> <linearGradient x1=".173" gradientTransform="matrix(0 -4035.78953 2269.9908 0 -20.638 3607.925)" xmlns:xlink="http://www.w3.org/1999/xlink" y1=".173" x2=".947" gradientUnits="userSpaceOnUse" y2=".947" xlink:type="simple" xlink:actuate="onLoad" id="f" xlink:show="other"> <stop stop-color="#E0D8F1" offset="0" /> <stop stop-color="#5527B4" offset="1" /> </linearGradient> <linearGradient x1="0" gradientTransform="matrix(10.51557 0 0 10.51557 567.492 566.992)" xmlns:xlink="http://www.w3.org/1999/xlink" y1="53.005" x2="106" gradientUnits="userSpaceOnUse" y2="53.005" xlink:type="simple" xlink:actuate="onLoad" id="i" xlink:show="other"> <stop stop-color="#FF6DAF" offset="0" /> <stop stop-color="#4C1BB0" offset="1" /> </linearGradient>',
  svgPartThree : "{0}</tspan></text></svg>",
  svgPartTwo : ' <filter x="0%" y="0%" width="100%" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:actuate="onLoad" height="100%" id="a" xlink:show="other"> <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" color-interpolation-filters="sRGB" /> </filter> <mask id="c"> <g filter="url(#a)"> <path fill-opacity=".6" d="M-225 -225H2475V2475H-225z" /> </g> </mask> </defs> <g clip-path="url(#b)"> <path fill="#FFF" d="M 0.5 0 L 2249.5 0 L 2249.5 2256.496094 L 0.5 2256.496094 Z M 0.5 0" /> <path fill="#FFF" d="M 0.5 0 L 2249.5 0 L 2249.5 2249 L 0.5 2249 Z M 0.5 0" /> <path fill="#4C1BB0" d="M 0.5 0 L 2249.5 0 L 2249.5 2249 L 0.5 2249 Z M 0.5 0" /> <g mask="url(#c)"> <g> <g clip-path="url(#d)"> <g clip-path="url(#e)"> <path fill="url(#f)" d="M 0.5 2249 L 2249.351562 2249 L 2249.351562 0 L 0.5 0 Z M 0.5 2249" /> </g> </g> </g> </g> </g> <g clip-path="url(#g)"> <g clip-path="url(#h)"> <path fill="url(#i)" d="M 567.492188 566.992188 L 567.492188 1681.640625 L 1682.140625 1681.640625 L 1682.140625 566.992188 Z M 567.492188 566.992188" /> </g> </g> <g clip-path="url(#j)"> <path fill="#FFF" d="M 1245.632812 1061.660156 L 1132.527344 1061.660156 L 1241.28125 841.566406 L 1117.304688 841.566406 L 1004.199219 1127.035156 L 1108.601562 1127.035156 L 1030.300781 1408.148438 Z M 1245.632812 1061.660156" /> </g> <text font-family="Open Sans" x="50%" y="90%" class="base" dominant-baseline="middle" text-anchor="middle" font-size="10em" stroke="white" fill="white"> <tspan>',
};

export const levels = ['bronze', 'silver', 'gold'];