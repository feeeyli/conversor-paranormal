import { CornerDownLeft, Space } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M", "Enter"],
  [",", "Space", "."],

  // '!', '"', "'", ',', '.', ':', ';', '?', 'A', 'B',
  // 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
  // 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
  // 'W', 'X', 'Y', 'Z', 'A', 'B', 'C', 'D', 'E', 'F',
  // 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
  // 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];

function getKeyContent(key: string) {
  if (key === "Space") return <Space size="1rem" />;
  if (key === "Enter") return <CornerDownLeft size="1rem" />;
  return key;
}

function App() {
  const [sigilsToText, setSigilsToText] = useState("");
  const [textToSigils, setTextToSigils] = useState("");
  const [holdingShift, setHoldingShift] = useState(false);

  function downHandler({ key }: KeyboardEvent) {
    if (key === "Shift") {
      setHoldingShift(true);
    }
  }

  function upHandler({ key }: KeyboardEvent) {
    if (key === "Shift") {
      setHoldingShift(false);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  return (
    <div className="flex flex-col items-center py-8">
      <h1 className="flex flex-col -gap-2 text-center">
        <span className="text-3xl font-semibold">Conversor Paranormal</span>
        <span className="font-sigils text-amber-300 [word-spacing:.25rem]">
          Conversor Paranormal
        </span>
      </h1>
      <div className="flex gap-8 mt-8">
        <div className="flex flex-col gap-2 items-center">
          <span>
            Texto para{" "}
            <span className="text-amber-300 font-sigils">sigilo</span>
          </span>
          <textarea
            name="tts"
            onChange={(e) => {
              setTextToSigils(e.target.value);
            }}
            value={textToSigils}
            className="resize-none w-96 h-56 border-2 border-amber-100 font-normal px-2 py-1 outline-none focus-within:ring-4 ring-amber-100/25"
            placeholder="Escreva o texto aqui..."
          ></textarea>
          <div className="[word-spacing:.25rem] font-sigils w-96 h-56 border-2 border-amber-300 font-normal px-2 py-1 break-words whitespace-pre-wrap overflow-y-auto">
            {textToSigils}
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <span>
            <span className="text-amber-300 font-sigils">Sigilo</span> para
            texto
          </span>
          <textarea
            name="stt"
            value={sigilsToText}
            onKeyDown={(ev) => {
              ev.preventDefault();

              const target = ev.target as HTMLTextAreaElement;

              if (ev.key !== "Backspace") return;

              const start =
                target.selectionStart === target.selectionEnd &&
                target.selectionEnd > 0
                  ? target.selectionEnd - 1
                  : target.selectionStart;

              const result =
                sigilsToText.slice(0, start) +
                sigilsToText.substring(target.selectionEnd);

              setSigilsToText(result);

              setTimeout(() => {
                target.setSelectionRange(start, start);
              }, 10);
            }}
            className="[word-spacing:.25rem] font-sigils resize-none w-96 h-56 border-2 border-amber-300 font-normal px-2 py-1 outline-none focus-within:ring-4 ring-amber-300/25"
            placeholder="Escreva os sigilos aqui"
          ></textarea>
          <div className="w-96 h-56 border-2 border-amber-100 font-normal px-2 py-1 break-words whitespace-pre-wrap overflow-y-auto">
            {sigilsToText}
          </div>
        </div>
      </div>
      <div
        className="flex flex-col items-center gap-1 mt-8 font-sigils group select-none"
        data-holding-shift={holdingShift}
      >
        {KEYS.map((row, i) => (
          <div className="flex gap-1" key={`row_${i}`}>
            {row.map((key) => (
              <button
                key={key}
                data-key={!["Enter", "Space"].includes(key) ? key : undefined}
                className={twMerge(
                  "key w-10 h-14 cursor-pointer bg-amber-300/5 hover:bg-amber-300/10 active:bg-amber-300/15 transition-colors flex items-center justify-center",
                  key === "Enter" && "w-26",
                  key === "Space" && "w-65"
                )}
                onClick={() => {
                  setSigilsToText((old) => {
                    if (key === "Space") return old + " ";
                    if (key === "Enter") return old + "\n";

                    return old + key.toLocaleLowerCase();
                  });
                }}
              >
                {getKeyContent(key)}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
