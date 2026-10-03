import raw from '../../websites.txt?raw';
import { sourcesFrom } from './sources';

export const SOURCES = sourcesFrom(raw);
export { studyPiece } from './sources';
