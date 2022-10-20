import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";
import Head from "next/head";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default function Home() {
  const [input, setInput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const combineWords = async (secondWord) => {
    try {
      const result = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `Combine the word "very" with another adjective to find a more suitable adjective.\n\nvery + cold = freezing\nvery + nice = charming\nvery + high = steep\nvery + shining = gleaming\nvery + ${secondWord} =`,
        temperature: 0.7,
        max_tokens: 10,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      const suggestion = result.data.choices[0].text;
      setSuggestion(suggestion);
    } catch (error) {
      console.error(error);
    }
  };
  const handleGet = async (input) => {
    combineWords(input);
  };

  const handleRandomResult = async () => {
    const adjective = await getRandomAdjective();
    setInput(adjective);
    handleGet(adjective);
  };

  const getRandomAdjective = async () => {
    try {
      const result = await openai.createCompletion({
        model: "text-davinci-002",
        prompt:
          'Come up with one random adjective that goes well with the word "very" in front of it:\nAdjective: very',
        temperature: 0.7,
        max_tokens: 10,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      const adjective = result.data.choices[0].text.trim();
      return adjective;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center ">
      <Head>
        <title>hilangvery.</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="flex-row space-y-20 m-auto">
        <div className="flex justify-center">
          <p className="text-7xl">🗿</p>
        </div>
        <div>
          <p className="text-slate-500 text-center">
            Combine &quot;very&quot; with a simple adjective and get a more
            concise adjective{" "}
          </p>
          <p className="text-slate-500 text-center text-xs font-light">
            Kombinasikan &quot;very&quot; dengan kata sifat sederhana dan
            dapatkan kata sifat yang lebih ringkas
          </p>
        </div>
        <div className="flex justify-center md:space-x-10">
          <h1 className="md:text-2xl text-xl font-semibold">very + </h1>
          <input
            type="text"
            className="border-b rounded md:px-4 md:py-2 border-gray-400 text-center placeholder:text-2xl placeholder:font-bold"
            placeholder="boring"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <p className="text-2xl font-semibold mx-1">=</p>
          <p
            className={`text-3xl font-semibold ${
              suggestion ? "text-green-500" : "text-gray-400"
            }`}
          >
            {suggestion || "tedious"}
          </p>
        </div>
        <div className="flex justify-center space-x-14">
          <button
            className="shadow-md bg-black text-white p-4 rounded font-semibold"
            onClick={() => handleGet(input)}
          >
            Get/Refresh Result
          </button>
          <button
            className="shadow-md bg-black text-white p-4 rounded font-semibold"
            onClick={handleRandomResult}
          >
            Random
          </button>
        </div>
      </div>
    </div>
  );
}
