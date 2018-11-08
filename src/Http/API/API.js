import { get } from '../Axios/ApiInvoke';
import { getSavedCrosswordValues } from '../../firebase/firebase';

export const GetNYTPuzzle = (publishDate) => {
    return get('https://raw.githubusercontent.com/doshea/nyt_crosswords/master/' + publishDate + '.json');
}

export const GetSavedCrossword = () => {
   return new Promise((resolve) => {
      resolve(getSavedCrosswordValues());
   }); 
}