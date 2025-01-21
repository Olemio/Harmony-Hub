export type Item = {
  id: string;
  price: number;
  name: string;
}[];

export type SongData = {
  id: string;
  name: string;
  songList: {
    artist: string;
    song: string;
  }[];
  createdAt: Date;
};
