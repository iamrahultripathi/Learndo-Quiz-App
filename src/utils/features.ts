import axios from "axios";
import _ from "lodash";
import { generate } from "random-words";

const generateMCQ = (meaning:{
    Text: string;
}[], idx: number): string[]=>{
    const correctAnswer: string = meaning[idx].Text;

    const allMeaningEceptForCorrect = meaning.filter((i)=> i.Text !== correctAnswer);
    const incorrectOptions: string[] = _.sampleSize(allMeaningEceptForCorrect, 3).map((i)=>i.Text);

    const mcqOptions = _.shuffle([...incorrectOptions,correctAnswer]);
    return mcqOptions;
}
export const translateWords = async (params: LangType): Promise<WordType[]> =>{
    try{
        const words = (generate(8) as string[]).map((i) => ({
            Text: i,
          }));

          
        const response = await axios.post('https://microsoft-translator-text.p.rapidapi.com/translate', words, {
            params: {
                'to[0]': params,
                'api-version': '3.0',
                profanityAction: 'NoAction',
                textType: 'plain'
              },
              headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': '8f7099e03cmsh86193da9e82ae41p17bd63jsna5f394d890a2',
                'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
              },
        });
        const receive: FetchedDataType[] = response.data;
        const arr: WordType[] = receive.map((i,idx)=>{
            const options: string[] = generateMCQ(words, idx);
            return {
                word: i.translations[0].text,
                meaning: words[idx].Text,
                options: options,
            }
        })
        return arr;
    } catch(error){
        console.log(error);
        throw new Error('Some error!!');
    }

}

export const countMatchingElements = (arr1: string[], arr2: string[]): number =>{
    if(arr1.length !== arr2.length) throw new Error('Arrays are not equal');

    let matchedCount = 0;

    for(let i =0; i< arr1.length;i++)
    {
        if(arr1[i] ===arr2[i])
        matchedCount++;
    }

    return matchedCount;
}

export const fetchAudio = async (text: string, language: LangType): Promise<string> =>{
    const encodedParams = new URLSearchParams({
        src: text,
        r:"0",
        c: "mp3",
        f: "8khz_8bit_mono",
        b64: "true",
    });

    if(language==='ja') encodedParams.set('hl', 'ja-jp');
    else if(language==='es') encodedParams.set('hl', 'es-es');
    else if(language==='fr') encodedParams.set('hl', 'fr-fr');
    else encodedParams.set('hl', 'hi-in');
    
    const {data}: {data:string} = await axios.post("https://voicerss-text-to-speech.p.rapidapi.com/", encodedParams, {
        params: {
            key: '0ab475ebff544b03bf28e347be5cec33'
          },
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '8f7099e03cmsh86193da9e82ae41p17bd63jsna5f394d890a2',
            'X-RapidAPI-Host': 'voicerss-text-to-speech.p.rapidapi.com'
          }
    });

    return data;
};