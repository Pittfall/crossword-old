import { get } from '../Axios/ApiInvoke';

export const GetMockPuzzle = () => {
    return get("https://raw.githubusercontent.com/doshea/nyt_crosswords/master/2017/01/04.json");
}