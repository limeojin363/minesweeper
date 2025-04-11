import { atom } from "jotai";

type InitialSetting = {
  vtSize: number;
  hztSize: number;
  mines: number;
};

export const initialSettingAtom = atom<InitialSetting>({
  vtSize: 10,
  hztSize: 10,
  mines: 10,
});
