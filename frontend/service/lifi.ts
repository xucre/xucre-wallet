import LifiSDK, { LiFi, ChainId, CoinKey, findDefaultToken } from "@lifi/sdk";

const lifi = new LiFi({
  integrator: 'Your dApp/company name'
})

export async function swap(wallet: any) {
  console.log(">> Request route");
  const routeRequest = {
    fromChainId: ChainId.POL, // Polygon
    fromAmount: "10000", // 1 USDT
    fromTokenAddress: findDefaultToken(CoinKey.USDC, ChainId.POL).address,
    toChainId: ChainId.POL, //
    toTokenAddress: findDefaultToken(CoinKey.MATIC, ChainId.POL).address,
  };

  const routeResponse = await lifi.getRoutes(routeRequest);
  const route = routeResponse.routes[0];
  console.log(">> Got Route");
  console.log(route);

  // execute Route
  console.log(">> Start Execution");
  const settings = {
    updateRouteHook: (updatedRoute: any) => {
      let lastExecution;
      for (const step of updatedRoute.steps) {
        if (step.execution) {
          lastExecution = step.execution;
        }
      }
      console.log(">> Execution Update");
      console.log(JSON.stringify(lastExecution, null, 2));
    },
  };
  await lifi.executeRoute(wallet, route, settings);

  console.log("DONE");
}