require("dotenv").config({ path: "../config.env" });
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.APPSETTING_OPENAI_API_SECRET,
});
const openai = new OpenAIApi(configuration);

//summarize text
exports.summarize = async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 500,
            temperature: 0.5,
        });
        if (response.data) {
            if (response.data.choices[0].text) {
                // Send the response as an object
                return res.status(200).json({ note: response.data.choices[0].text.trim() });
            }
        }
    } catch (err) {
        return res.status(404).json({ message: err.message});
    }
}

//generate a paragraph
exports.paragraph = async (req, res) => {
    const { text } = req.body;

    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Write a detailed paragraph about: \n${text}`,
            max_tokens: 500,
            temperature: 0.5,
        });
        if (response.data) {
            if (response.data.choices[0].text) {
                // Send the response as an object
                return res.status(200).json({ paragraph: response.data.choices[0].text.trim() });
            }
        }
    } catch (err) {
        return res.status(404).json({ message: err.message});
    }


}
