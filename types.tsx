// Data

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

// Components

export type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

export type FormInputPorps = {
  name: "songAmount" | "genre" | "tempo" | "theme" | "name" | "songList";
  label: string;
  defaultValue: string | number;
  disabled?: boolean;
  type?: string;
  className?: string;
};
