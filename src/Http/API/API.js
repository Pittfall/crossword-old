import { get } from '../Axios/ApiInvoke';

export const GetNYTPuzzle = (publishDate) => {
    return get('https://raw.githubusercontent.com/doshea/nyt_crosswords/master/' + publishDate + '.json');
}