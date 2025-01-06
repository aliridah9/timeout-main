/* eslint-disable */

// The only code you may write in this file is inside the `speak` function.
// Add the necessary code in the `speak` function so that the page displays a "Passed" message.

const { log, clearLogs, getLogs } = (() => {
  let logs = [];
  return {
    log: (msg) => logs.push(msg),
    clearLogs: () => {
      logs = [];
    },
    getLogs: () => [...logs],
  };
})();

export default function SpeakPage() {
  clearLogs();

  speak((ragnar, lagertha, hello, hey) => {
    hello(ragnar);
    hey(lagertha);
  });

  speak((sup, floki) => {
    sup(floki);
  });

  speak((ecbert, king, greeting, your, majesty, harald, sup) => {
    exec({ ecbert, king, greeting, your, majesty, harald, sup });
  });

  function exec({ king, your, majesty, harald, sup, ecbert, greeting }) {
    king(ecbert)(greeting)(your)(majesty);
    king(harald)(sup);
  }

  const logsAreCorrect =
    getLogs().join("\n") ===
    `hello ragnar
hey lagertha
sup floki
king ecbert greeting your majesty
king harald sup`;

  return (
    <div className="flex h-full items-center justify-center ">
      <div className="rounded-3xl bg-white p-6 lg:min-w-[300px]">
        <div className="flex flex-col">
          <div className="flex">
            <h1 className="flex-1 text-xl ">
              {logsAreCorrect ? (
                <>
                  Passed <span className="text-green">✓</span>
                </>
              ) : (
                <>
                  Failed <span className="text-red">✗</span>
                </>
              )}
            </h1>
          </div>
          <div className="flex-1 py-3">
            {getLogs().map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function speak(fn) {
  const dynamicArgs = new Proxy(
    {},
    {
      get(_, property) {
        return (nextArg) => {
          if (typeof nextArg === "function") {
            return nextArg(property); // Handle chaining of functions
          }
          log(`${property} ${nextArg}`); // Log the final string
        };
      },
    }
  );

  // Call the provided function with the proxy arguments
  fn(dynamicArgs, dynamicArgs, dynamicArgs, dynamicArgs, dynamicArgs);
}

export { speak, getLogs };
