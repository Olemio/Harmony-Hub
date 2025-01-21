export type Item = {
  id: string;
  price: number;
  name: string;
}[];

export type SongData = {
  name: string;
  recommendations: {
    artist: string;
    song: string;
  }[];
};
