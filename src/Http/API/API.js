import { get } from '../Axios/ApiInvoke';

export const GetNYTPuzzle = (publishDate) => {
    return get('https://raw.githubusercontent.com/doshea/nyt_crosswords/master/' + publishDate + '.json');
}

export const GetPuzzleDate = () => {
   return get('https://crossword-8263d.firebaseio.com/date.json');
}