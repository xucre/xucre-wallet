const exportWallet = `<!DOCTYPE html>
<html>

<head>
  <title>Xucre Wallet - {0}</title>
  <link rel="icon" type="image/x-icon" href="https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png">
  <style>
    body {
      background-color: #c9c9c9;
      font-family: sans-serif;
    }

    .logo {
      width: 50%;
      background-size: cover;
      padding: bottom 10px;
    }

    .key {
      background-color: #ffffff;
      color: #000000;
      border: 1px gray solid;
      border-radius: 2rem;
      padding: 20px;
      margin: 0; 
      word-wrap: normal;
    }

    code {
      word-wrap: break-word;
      display: block;
      max-width: 80vw;
      font-size: 2rem;
    }

    .title {
      padding-bottom: 10px;
      font-weight: bold;
      font-size: 4rem;
      max-width: 80vw;
      word-wrap: normal;
    }
    
    .wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <img class="logo" src="https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png" />
    <div class="title"><p>{0}</p></div>
    <div class="key"><code>{1}</code></div>
  </div>
</body>

</html>`;

const formatString = (...args: any[]) => {
  return exportWallet.replace(/{([0-9]+)}/g, function (match, index) {
    return typeof args[index] === 'undefined' ? match : args[index];
  });
}

export default formatString;